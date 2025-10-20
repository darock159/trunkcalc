import treeIV from "../data/rates/tree_iv.json";
import arbotectAll from "../data/rates/arbotect.json";
import ironAll from "../data/rates/iron.json";
import { rateSourceFor, TreeType, InjectionType } from "./datasets";

type Output =
  | { dbh: number; product: number; units: string }
  | { dbh: number; product: number; water: number; units: { product: string; water: string } }
  | { dbh: number; notRecommended: true; reason: string };

function pickData(treeType: TreeType, injectionType: InjectionType) {
  const source = rateSourceFor(treeType, injectionType);
  if (source === "TREE IV") return { source, data: treeIV as any[] };
  if (source === "ARBOTECT") {
    const t = treeType === "Sycamore" ? (arbotectAll as any).Sycamore : (arbotectAll as any).Elm;
    return { source, data: t as any[] };
  }
  const t = treeType === "Birch" ? (ironAll as any).Birch : (ironAll as any).Oak;
  return { source: "IRON" as const, data: t as any[] };
}

export function calculateRate(dbh: number, treeType: TreeType, injectionType: InjectionType): Output {
  const rounded = Math.round(dbh);
  const { source, data } = pickData(treeType, injectionType);
  const numeric = data.filter((d: any) => typeof d.dbh === "number").sort((a: any,b: any)=>a.dbh-b.dbh);

  if (source === "ARBOTECT" && treeType === "Elm") {
    const minElm = Math.min(...numeric.map((d: any) => d.dbh));
    if (rounded < minElm) {
      return { dbh: rounded, notRecommended: true, reason: "elm under 10 inches is not recommended for arbotect." };
    }
  }

  const exact = numeric.find((d: any) => d.dbh === rounded);
  if (exact) return shape(source, rounded, exact);

  const max = Math.max(...numeric.map((d: any)=>d.dbh));
  if (rounded > max) {
    if (source === "TREE IV") return { dbh: rounded, product: rounded * 10, units: "mL" };
    return shape(source, rounded, numeric[numeric.length-1]);
  }
  let cand = numeric[0];
  for (const row of numeric) { if (row.dbh <= rounded) cand = row; else break; }
  return shape(source, rounded, cand);
}

function shape(source: "TREE IV"|"ARBOTECT"|"IRON", dbh: number, row: any): Output {
  if (source === "ARBOTECT" || (source === "IRON" && row.units?.product)) {
    return { dbh, product: row.product, water: row.water, units: row.units };
  }
  return { dbh, product: row.product, units: row.units ?? "mL" };
}