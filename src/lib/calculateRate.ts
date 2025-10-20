import arbotect from "../data/rates/arbotect.json";
import treeiv from "../data/rates/tree_iv.json";
import iron from "../data/rates/iron.json";
import oakWilt from "../data/rates/oak_wilt.json";
import { InjectionType, TreeType } from "./datasets";

type Row = any;
type Source = "TREE IV" | "ARBOTECT" | "IRON" | "ALAMO";

function selectSet(tree: TreeType, inj: InjectionType): { source: Source, data: Row[] } {
  if (inj === "Tree IV") return { source: "TREE IV", data: treeiv as any[] };
  if (inj === "Arbotect") return { source: "ARBOTECT", data: (arbotect as any)[tree] || [] };
  if (inj === "Oak Wilt") return { source: "ALAMO", data: (oakWilt as any)["Oak - Wilt"] || [] };
  return { source: "IRON", data: (iron as any)[tree] || [] };
}

export function calculateRate(dbh: number, treeType: string, injectionType: string) {
  const rounded = Math.round(dbh);
  const tree = treeType as TreeType;
  const inj = injectionType as InjectionType;

  const { source, data } = selectSet(tree, inj);

  const rows = (Array.isArray(data) ? data : [])
    .map((r: any) => ({
      ...r,
      _dbh: typeof r.dbh === "number" ? r.dbh : Number(String(r.dbh).replace(/[^0-9.]/g,"") || NaN)
    }))
    .filter((r: any) => Number.isFinite(r._dbh))
    .sort((a: any,b: any) => a._dbh - b._dbh);

  if (inj === "Arbotect" && tree === "Elm" && rounded < 10) {
    return { dbh: rounded, notRecommended: true, source };
  }

  const exact = rows.find((r:any) => r._dbh === rounded);
  if (exact) return shape(source, rounded, exact);

  if (rows.length) {
    const max = rows[rows.length - 1]._dbh;

    if (rounded <= max) {
      const lower = rows.filter((r:any) => r._dbh <= rounded).pop();
      if (lower) return shape(source, rounded, lower);
    }

    // overflow behaviors
    if (rounded > max) {
      if (inj === "Arbotect" && tree === "Sycamore" && rounded > 50) {
        return { dbh: rounded, product: +(2.4 * rounded).toFixed(1), water: +(30 + 0.5*(rounded-50)).toFixed(1), units: { product: "oz", water: "gal" }, source };
      }
      if (inj === "Arbotect" && tree === "Elm" && rounded > 50) {
        return { dbh: rounded, product: +(1.2 * rounded).toFixed(1), water: 60 + (rounded-50), units: { product: "oz", water: "gal" }, source };
      }
      if (inj === "Tree IV" && tree === "Ash") {
        return { dbh: rounded, product: rounded * 10, units: "mL", source };
      }
      if (inj === "Iron" && rounded > 30) {
        if (tree === "Oak") {
          return { dbh: rounded, product: +(1.0 * rounded).toFixed(1), water: +((rounded)/4).toFixed(1), units: { product:"oz", water:"gal" }, source };
        }
        if (tree === "Birch") {
          return { dbh: rounded, product: +(1.25 * rounded).toFixed(2), water: +((rounded)/4).toFixed(1), units: { product:"oz", water:"gal" }, source };
        }
      }
      const last = rows[rows.length-1];
      return shape(source, rounded, last);
    }
  }

  if (inj === "Arbotect" && rounded === 50) {
    if (tree === "Elm") return { dbh: 50, product: 120, water: 60, units: { product:"oz", water:"gal" }, source };
    if (tree === "Sycamore") return { dbh: 50, product: 120, water: 30, units: { product:"oz", water:"gal" }, source };
  }

  return { dbh: rounded, product: 0, units: "", source };
}

function shape(source: Source, dbh: number, row: any) {
  const waterNum = typeof row.water === "number" ? row.water : Number(row.water);

  // Oak Wilt: show range if present
  if (source === "ALAMO" && (row.productLow != null || row.productHigh != null)) {
    const out: any = { dbh, units: { product: "oz", water: "gal" }, source };
    if (row.productLow != null) out.productLow = Number(row.productLow);
    if (row.productHigh != null) out.productHigh = Number(row.productHigh);
    if (Number.isFinite(waterNum)) out.water = waterNum;
    return out;
  }

  if (source === "TREE IV") {
    return { dbh, product: Number(row.product) || 0, units: "mL", source };
  }

  const prod = row.product ?? row.oz ?? row.amount ?? 0;
  const out: any = { dbh, product: Number(prod) || 0, units: { product: "oz", water: "gal" }, source };
  if (Number.isFinite(waterNum)) out.water = waterNum;
  return out;
}
