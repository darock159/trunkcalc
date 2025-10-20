const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

function num(x){ const n = parseFloat(String(x).replace(/[^0-9.\-]/g,"")); return Number.isFinite(n) ? n : NaN; }

const args = process.argv.slice(2);
const src = args[0];
if (!src || !fs.existsSync(src)) {
  console.error("excel file not found. usage:");
  console.error("  node scripts/xlsx-to-oak-wilt-json.cjs ~/Oak_Wilt_Alamo_RateChart.xlsx --headerRow 4 --dbh 0 --low 2 --high 3 --water 1");
  process.exit(1);
}
function pickFlag(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i+1]) : null;
}
const override = {
  dbh: pickFlag("dbh"),
  low: pickFlag("low"),
  high: pickFlag("high"),
  water: pickFlag("water"),
  headerRow: pickFlag("headerRow")
};

const wb = XLSX.readFile(src);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows2d = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
if (!rows2d.length) { console.error("no rows in sheet"); process.exit(1); }

// header row from flags or auto detect
let headerRowIdx = override.headerRow ?? rows2d.findIndex(r =>
  r.some(c => String(c).toLowerCase().includes("dbh") || String(c).toLowerCase().includes("diameter"))
);
if (headerRowIdx < 0) headerRowIdx = 0;

const headersRaw = rows2d[headerRowIdx].map(h => String(h).trim());
const headers = headersRaw.map(h => h.toLowerCase());
const dataRows = rows2d.slice(headerRowIdx + 1);

// use explicit indices you gave from inspector
let dbhIdx   = override.dbh;
let lowIdx   = override.low;
let highIdx  = override.high;
let waterIdx = override.water;

if (dbhIdx == null) dbhIdx = headers.findIndex(h => ["dbh","diameter","inch","inches","in"].some(k=>h.includes(k)));
if (lowIdx == null) lowIdx = headers.findIndex(h => ["low","min"].some(k=>h.includes(k)));
if (highIdx== null) highIdx= headers.findIndex(h => ["high","max"].some(k=>h.includes(k)));
if (waterIdx== null) waterIdx= headers.findIndex(h => ["water","gal","gallon"].some(k=>h.includes(k)));

if (dbhIdx < 0) { console.error("could not find a dbh column. headers:", headersRaw); process.exit(1); }

const seen = new Set();
const out = [];
for (const row of dataRows) {
  const di = num(row[dbhIdx]);
  if (!Number.isFinite(di)) continue;
  const dbh = Math.round(di);
  if (seen.has(dbh)) continue;
  seen.add(dbh);

  const low   = lowIdx   >= 0 ? num(row[lowIdx])   : NaN;  // mL
  const high  = highIdx  >= 0 ? num(row[highIdx])  : NaN;  // mL
  const water = waterIdx >= 0 ? num(row[waterIdx]) : NaN;  // gal

  const rec = {
    dbh,
    productLow: Number.isFinite(low) ? Number(low) : null,     // mL
    productHigh: Number.isFinite(high) ? Number(high) : null,  // mL
    units: { product: "mL", water: "gal" }
  };
  if (Number.isFinite(water)) rec.water = Number(water);
  out.push(rec);
}

out.sort((a,b)=>a.dbh - b.dbh);

const json = { "Oak - Wilt": out };
fs.mkdirSync(path.join("src","data","rates"), { recursive: true });
fs.mkdirSync(path.join("public","rates"), { recursive: true });
fs.writeFileSync(path.join("src","data","rates","oak_wilt.json"), JSON.stringify(json, null, 2));
fs.writeFileSync(path.join("public","rates","oak_wilt.json"), JSON.stringify(json, null, 2));

const haveNumbers = out.filter(r => r.productLow != null || r.productHigh != null).length;
console.log("header row used:", headerRowIdx);
console.log("col indexes -> dbh:", dbhIdx, " low:", lowIdx, " high:", highIdx, " water:", waterIdx);
console.log("units saved: product=mL, water=gal");
console.log("rows total:", out.length, "with numbers:", haveNumbers);
