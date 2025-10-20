import { create } from "zustand";
export const useAppStore = create((set) => ({
    lastResult: undefined,
    setResult: (r) => set({ lastResult: r }),
    clearResult: () => set({ lastResult: undefined }),
    init: () => { }
}));
