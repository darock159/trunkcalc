import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import Calculator from "./components/Calculator";
import MenuSheet from "./components/MenuSheet";
export default function App() {
    const init = useAppStore(s => s.init);
    useEffect(() => { init(); }, [init]);
    return (_jsxs("div", { className: "safe mx-auto max-w-md p-4 pb-28", children: [_jsxs("header", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("img", { src: "/icons/ryan-urban-forestry.png", alt: "Ryan Urban Forestry", className: "h-12 w-auto" }), _jsx("span", { className: "text-2xl font-semibold text-[#1F4D33] leading-none", children: "TrunkCalc" })] }), _jsx(MenuSheet, {})] }), _jsx(Calculator, {}), _jsx("div", { className: "fixedbar", children: _jsx("div", { className: "mx-auto max-w-md p-3", children: _jsx("p", { className: "text-xs text-neutral-600", children: "install from browser menu to add to home screen." }) }) })] }));
}
