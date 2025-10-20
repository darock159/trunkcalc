const XLSX = require("xlsx");
const fs = require("fs");

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error("usage: node scripts/inspect-xlsx.cjs ~/Oak_Wilt_Alamo_RateChart.xlsx");
  process.exit(1);
}

const wb = XLSX.readFile(src);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows2d = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

if (!rows2d.length) { console.error("no rows"); process.exit(1); }

console.log("sheet:", wb.SheetNames[0]);
console.log("total rows:", rows2d.length);
for (let r = 0; r < Math.min(rows2d.length, 10); r++) {
  const row = rows2d[r].map(v => String(v).trim());
  console.log(String(r).padStart(3), row.map((v,i)=>`[${i}] ${v}`).join(" | "));
}
