
export const treeTypes = ["Ash","Elm","Sycamore","Oak","Birch"] as const;
export const injectionTypes = ["Tree IV","Arbotect","Iron"] as const; // retained for compatibility
export type TreeType = (typeof treeTypes)[number];
export type InjectionType = (typeof injectionTypes)[number];

export function rateSourceFor(tree: TreeType, inj: InjectionType) {
  if (tree === "Ash" && inj === "Tree IV") return "TREE IV" as const;
  if ((tree === "Elm" || tree === "Sycamore") && inj === "Arbotect") return "ARBOTECT" as const;
  if ((tree === "Oak" || tree === "Birch") && inj === "Iron") return "IRON" as const;
  if (inj === "Tree IV") return "TREE IV" as const;
  if (inj === "Arbotect") return "ARBOTECT" as const;
  return "IRON" as const;
}

export function inferInjection(tree: TreeType): InjectionType {
  if (tree === "Ash") return "Tree IV";
  if (tree === "Elm" || tree === "Sycamore") return "Arbotect";
  return "Iron";
}
