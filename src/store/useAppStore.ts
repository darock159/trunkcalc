
import { create } from "zustand";
import { TreeType, InjectionType } from "../lib/datasets";

export type Output =
  | { dbh: number; product: number; units: string }
  | { dbh: number; product: number; water: number; units: { product: string; water: string } }
  | { dbh: number; notRecommended: true; reason: string };

export type ResultRecord = {
  input: { treeType: TreeType; injectionType: InjectionType; dbhOriginal: number; dbhUnit: "in" | "cm"; dbhRoundedInches: number; };
  output: Output;
  rateSource: "TREE IV" | "ARBOTECT" | "IRON";
};

type Store = {
  lastResult?: ResultRecord;
  setResult: (r: ResultRecord) => void;
  clearResult: () => void;
  init: () => void;
};

export const useAppStore = create<Store>((set) => ({
  lastResult: undefined,
  setResult: (r) => set({ lastResult: r }),
  clearResult: () => set({ lastResult: undefined }),
  init: () => {}
}));
