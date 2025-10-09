import { create } from "zustand";
import arbotectBundled from "../data/rates/arbotect.json";
import treeIVBundled from "../data/rates/tree_iv.json";
import ironBundled from "../data/rates/iron.json";
import { loadCachedRates, saveRates } from "../lib/localRates";

type Rates = {
  arbotect: any;
  tree_iv: any;
  iron: any;
  version: string;
};

type RatesStore = {
  rates: Rates;
  refreshRates: () => Promise<void>;
};

const initial: Rates = {
  arbotect: arbotectBundled,
  tree_iv: treeIVBundled,
  iron: ironBundled,
  version: "bundled"
};

export const useRates = create<RatesStore>((set) => ({
  rates: initial,
  refreshRates: async () => {
    try {
      const cached = await loadCachedRates();
      if (cached) set({ rates: cached });

      if (!navigator.onLine) return;

      const verRes = await fetch("/version.json", { cache: "no-store" });
      if (!verRes.ok) return;
      const verData = await verRes.json();
      const serverVersion: string = verData.rates ?? "unknown";

      if (cached && cached.version === serverVersion) return;

      const [arb, tiv, irn] = await Promise.all([
        fetch("/rates/arbotect.json", { cache: "no-store" }).then(r => r.json()),
        fetch("/rates/tree_iv.json", { cache: "no-store" }).then(r => r.json()),
        fetch("/rates/iron.json", { cache: "no-store" }).then(r => r.json())
      ]);

      const payload: Rates = {
        arbotect: arb,
        tree_iv: tiv,
        iron: irn,
        version: serverVersion
      };

      await saveRates(payload);
      set({ rates: payload });
    } catch {
      // quiet fail offline
    }
  }
}));
