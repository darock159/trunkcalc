export const treeTypes = ["Ash", "Elm", "Sycamore", "Oak", "Birch", "Oak - Wilt"];
export function inferInjection(tree) {
    if (tree === "Ash")
        return "Tree IV";
    if (tree === "Elm" || tree === "Sycamore")
        return "Arbotect";
    if (tree === "Oak - Wilt")
        return "Oak Wilt";
    return "Iron"; // Oak, Birch
}
export function rateSourceFor(tree, inj) {
    if (tree === "Ash" && inj === "Tree IV")
        return "TREE IV";
    if ((tree === "Elm" || tree === "Sycamore") && inj === "Arbotect")
        return "ARBOTECT";
    if ((tree === "Oak" || tree === "Birch") && inj === "Iron")
        return "IRON";
    if (tree === "Oak - Wilt" && inj === "Oak Wilt")
        return "ALAMO";
    if (inj === "Tree IV")
        return "TREE IV";
    if (inj === "Arbotect")
        return "ARBOTECT";
    if (inj === "Oak Wilt")
        return "ALAMO";
    return "IRON";
}
// dropdown labels shown in the UI
export const treeLabels = {
    Ash: "Ash",
    Elm: "Elm",
    Sycamore: "Sycamore",
    Oak: "Oak - Iron",
    Birch: "Birch - Iron",
    "Oak - Wilt": "Oak - Wilt"
};
