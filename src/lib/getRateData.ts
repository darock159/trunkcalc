import { useRates } from "../store/useRates";
import type { TreeType, InjectionType } from "./datasets";

// bundled fallbacks
import arbotectBundled from "../data/rates/arbotect.json";
import treeIVBundled from "../data/rates/tree_iv.json";
import ironBundled from "../data/rates/iron.json";

function asArray(x: any): any[] {
  return Array.isArray(x) ? x : [];
}

export function useRateData(tree: TreeType, inj: InjectionType) {
  const { rates } = useRates();

  if (inj === "Arbotect") {
    const a: any = (rates as any).arbotect;
    if (a && typeof a === "object" && !Array.isArray(a)) {
      const exact = asArray(a[tree]);
      if (exact.length) return exact;
      for (const k of Object.keys(a)) {
        if (Array.isArray(a[k]) && a[k].length) return a[k];
      }
      return asArray((arbotectBundled as any)[tree])?.length ? (arbotectBundled as any)[tree] : asArray(arbotectBundled as any);
    }
    const flat = asArray(a);
    return flat.length ? flat : asArray(arbotectBundled as any);
  }

  if (inj === "Tree IV") {
    const flat = asArray((rates as any).tree_iv);
    return flat.length ? flat : asArray(treeIVBundled as any);
  }

  // Iron may be nested by tree type now
  const iron: any = (rates as any).iron;
  if (iron && typeof iron === "object" && !Array.isArray(iron)) {
    const exact = asArray(iron[tree]);
    if (exact.length) return exact;
    for (const k of Object.keys(iron)) {
      if (Array.isArray(iron[k]) && iron[k].length) return iron[k];
    }
    const fall = (ironBundled as any);
    if (fall && typeof fall === "object" && !Array.isArray(fall) && Array.isArray(fall[tree])) return fall[tree];
    return asArray(fall as any);
  }
  const flatIron = asArray(iron);
  return flatIron.length ? flatIron : asArray(ironBundled as any);
}