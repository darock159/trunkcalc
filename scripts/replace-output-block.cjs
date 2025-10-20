const fs = require("fs");
const path = require("path");

const file = path.join("src","components","Calculator.tsx");
let s = fs.readFileSync(file, "utf8");

const startTok = "function OutputBlock(";
const i = s.indexOf(startTok);
if (i < 0) {
  console.error("could not find OutputBlock");
  process.exit(1);
}
const braceStart = s.indexOf("{", i);
if (braceStart < 0) {
  console.error("could not find opening brace of OutputBlock");
  process.exit(1);
}
// find matching closing brace
let depth = 0, end = -1;
for (let k = braceStart; k < s.length; k++) {
  const ch = s[k];
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) { end = k; break; }
  }
}
if (end < 0) {
  console.error("could not match closing brace of OutputBlock");
  process.exit(1);
}

const newBlock =
`function OutputBlock({
  dbh, rateSource, output
}: {
  dbh: number;
  rateSource: "TREE IV" | "ARBOTECT" | "IRON" | "ALAMO";
  output: any;
}) {
  // special footer wording for iron sources
  const displayLabel = rateSource === "IRON" ? "Metro PHC Lesco Rate Chart" : rateSource;

  // oak wilt (alamo), product in mL, water in gal
  if (rateSource === "ALAMO") {
    const low = (output?.productLow ?? null);
    const high = (output?.productHigh ?? null);
    const water = (output?.water ?? null);
    const showLow = low == null ? "n/a" : low;
    const showHigh = high == null ? "n/a" : high;
    const showWater = water == null ? "n/a" : water;
    const footer = "Alamo Fungicide - Propiconazole 14.3%";
    return (
      <div>
        <div className="text-2xl font-semibold">dbh {dbh} in</div>
        <div className="mt-3 text-2xl text-[color:#1F4D33] font-semibold">
          {showLow} mL ({showHigh} mL HIGH), Water {showWater} gal
        </div>
        <div className="mt-2 text-sm text-neutral-600">{footer}</div>
      </div>
    );
  }

  // arbotect
  if ("water" in (output ?? {})) {
    if (rateSource === "ARBOTECT") {
      return (
        <div>
          <div className="text-2xl font-semibold">dbh {dbh} in</div>
          <div className="mt-3 text-2xl text-[color:#1F4D33] font-semibold">
            {output.product} oz of Arbotect, water {output.water} gal
          </div>
          <div className="mt-2 text-sm text-neutral-600">{displayLabel}</div>
        </div>
      );
    }
    // iron
    if (rateSource === "IRON") {
      return (
        <div>
          <div className="text-2xl font-semibold">dbh {dbh} in</div>
          <div className="mt-3 text-2xl text-[color:#1F4D33] font-semibold">
            {output.product} oz of Iron, water {output.water} gal
          </div>
          <div className="mt-2 text-sm text-neutral-600">{displayLabel}</div>
        </div>
      );
    }
  }

  // tree iv fallback
  return (
    <div>
      <div className="text-2xl font-semibold">dbh {dbh} in</div>
      <div className="mt-3 text-2xl text-[color:#1F4D33] font-semibold">
        {output.product} {output.units}
      </div>
      <div className="mt-2 text-sm text-neutral-600">{displayLabel}</div>
    </div>
  );
}
`;

const out = s.slice(0, i) + newBlock + s.slice(end + 1);
fs.writeFileSync(file, out, "utf8");
console.log("OutputBlock replaced ok.");
