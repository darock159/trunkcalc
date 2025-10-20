import { useRates } from "../store/useRates";
// bundled fallbacks
import arbotectBundled from "../data/rates/arbotect.json";
import treeIVBundled from "../data/rates/tree_iv.json";
import ironBundled from "../data/rates/iron.json";
function asArray(x) {
    return Array.isArray(x) ? x : [];
}
export function useRateData(tree, inj) {
    const { rates } = useRates();
    if (inj === "Arbotect") {
        const a = rates.arbotect;
        if (a && typeof a === "object" && !Array.isArray(a)) {
            const exact = asArray(a[tree]);
            if (exact.length)
                return exact;
            for (const k of Object.keys(a)) {
                if (Array.isArray(a[k]) && a[k].length)
                    return a[k];
            }
            return asArray(arbotectBundled[tree])?.length ? arbotectBundled[tree] : asArray(arbotectBundled);
        }
        const flat = asArray(a);
        return flat.length ? flat : asArray(arbotectBundled);
    }
    if (inj === "Tree IV") {
        const flat = asArray(rates.tree_iv);
        return flat.length ? flat : asArray(treeIVBundled);
    }
    // Iron may be nested by tree type now
    const iron = rates.iron;
    if (iron && typeof iron === "object" && !Array.isArray(iron)) {
        const exact = asArray(iron[tree]);
        if (exact.length)
            return exact;
        for (const k of Object.keys(iron)) {
            if (Array.isArray(iron[k]) && iron[k].length)
                return iron[k];
        }
        const fall = ironBundled;
        if (fall && typeof fall === "object" && !Array.isArray(fall) && Array.isArray(fall[tree]))
            return fall[tree];
        return asArray(fall);
    }
    const flatIron = asArray(iron);
    return flatIron.length ? flatIron : asArray(ironBundled);
}
