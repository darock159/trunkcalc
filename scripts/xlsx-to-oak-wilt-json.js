const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error("excel file not found. pass the full path, e.g.: node scripts/xlsx-to-oak-wilt-json.js ~/Oak_Wilt_Alamo_RateChart.xlsx");
  process.exit(1);
}

const wb = XLSX.readFile(src);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

// find likely columns by header text
function findKey(keys, headers) {
  const idx = headers.findIndex(h => keys.some(k => h.includes(k)));
  return idx >= 0 ? headers[idx] : null;
}
if (!rows.length) {
  console.error("no rows found in first sheet");
  process.exit(1);
}
const headers = Object.keys(rows[0]).map(h => String(h).trim().toLowerCase());

const dbhKey   = findKey(["dbh","diameter","inch","inches","in"], headers);
const lowKey   = findKey(["low","min"], headers);
const highKey  = findKey(["high","max"], headers);
const waterKey = findKey(["water","gal","gallon"], headers);

if (!dbhKey) {
  console.error("could not find a dbh-like column. headers:", headers);
  process.exit(1);
}

const out = [];
const seen = new Set();

rows.forEach(r => {
  const get = (k) => {
    if (!k) return "";
    // find original case key
    const realKey = Object.keys(r).find(R => R.trim().toLowerCase() === k);
    return r[realKey];
  };

  const dbh = parseFloat(get(dbhKey));
  if (!Number.isFinite(dbh)) return;
  const dbhInt = Math.round(dbh);
  if (seen.has(dbhInt)) return;
  seen.add(dbhInt);

  const low = parseFloat(get(lowKey));
  const high = parseFloat(get(highKey));
  const water = parseFloat(get(waterKey));

  const row = {
    dbh: dbhInt,
    productLow: Number.isFinite(low) ? low : null,
    productHigh: Number.isFinite(high) ? high : null,
    units: { product: "oz", water: "gal" }
  };
  if (Number.isFinite(water)) row.water = water;

  out.push(row);
});

out.sort((a,b) => a.dbh - b.dbh);

const json = { "Oak - Wilt": out };

fs.mkdirSync(path.join("src","data","rates"), { recursive: true });
fs.mkdirSync(path.join("public","rates"), { recursive: true });
fs.writeFileSync(path.join("src","data","rates","oak_wilt.json"), JSON.stringify(json, null, 2));
fs.writeFileSync(path.join("public","rates","oak_wilt.json"), JSON.stringify(json, null, 2));

console.log("wrote src/data/rates/oak_wilt.json and public/rates/oak_wilt.json with", out.length, "rows");
