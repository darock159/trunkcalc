import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateRate } from "../lib/calculateRate";
import { rateSourceFor, inferInjection, treeTypes, treeLabels } from "../lib/datasets";
import { useAppStore } from "../store/useAppStore";
import { useEffect } from "react";
const schema = z.object({
    treeType: z.enum(["Ash", "Elm", "Sycamore", "Oak", "Birch", "Oak - Wilt"]),
    dbh: z
        .string()
        .min(1, "required")
        .refine(v => !Number.isNaN(Number(v)), "enter a number")
        .refine(v => Number(v) > 0, "must be positive")
});
export default function Calculator() {
    const setResult = useAppStore(s => s.setResult);
    const clearResult = useAppStore(s => s.clearResult);
    const result = useAppStore(s => s.lastResult);
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { treeType: "Ash", dbh: "" }
    });
    const dbhWatch = watch("dbh");
    useEffect(() => {
        if (dbhWatch === "") {
            clearResult();
        }
    }, [dbhWatch, clearResult]);
    function onSubmit(values) {
        const rounded = Math.round(Number(values.dbh));
        const tree = values.treeType;
        const inj = inferInjection(tree);
        const source = rateSourceFor(tree, inj);
        const out = calculateRate(rounded, tree, inj);
        setResult({
            input: { treeType: tree, injectionType: inj, dbhOriginal: rounded, dbhUnit: "in", dbhRoundedInches: rounded },
            output: out, rateSource: source
        });
        document.activeElement?.blur();
    }
    function onClear() {
        reset({ dbh: "", treeType: watch("treeType") });
        clearResult();
    }
    return (_jsxs("div", { children: [_jsx("div", { className: "card p-4", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "grid gap-3", children: [_jsx("div", { className: "text-xl font-medium", children: "Manual Entry DBH" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { inputMode: "numeric", className: "input flex-1", placeholder: "e.g., 19", ...register("dbh"), onChange: (e) => {
                                        const v = e.target.value;
                                        if (v === "")
                                            onClear();
                                        else
                                            setValue("dbh", v, { shouldValidate: false });
                                    } }), _jsx("button", { type: "button", className: "btn btn-outline", onClick: onClear, "aria-label": "clear", children: "clear" })] }), _jsx("label", { className: "text-sm", children: "Enter DBH" }), errors.dbh ? _jsx("p", { className: "text-sm text-red-600", children: errors.dbh.message }) : null, _jsx("button", { className: "btn btn-primary", type: "submit", children: "calculate" }), _jsx("select", { className: "select", ...register("treeType"), children: treeTypes.map(t => _jsx("option", { value: t, children: treeLabels[t] || t }, t)) })] }) }), _jsx("div", { className: "mt-4 card p-6 text-center min-h-[180px] flex items-center justify-center", children: result ? (("notRecommended" in result.output) ? (_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-semibold", children: ["dbh ", result.input.dbhRoundedInches, " in"] }), _jsx("div", { className: "mt-3 text-red-700 font-semibold", children: "not recommended, elm under 10 inches should not be treated" }), _jsx("div", { className: "mt-2 text-sm text-neutral-600", children: result.rateSource })] })) : (_jsx(OutputBlock, { dbh: result.input.dbhRoundedInches, rateSource: result.rateSource, output: result.output }))) : (_jsx("div", { className: "text-neutral-500", children: "results will appear here" })) })] }));
}
function OutputBlock({ dbh, rateSource, output }) {
    // special footer wording for iron
    const displayLabel = rateSource === "IRON" ? "Metro PHC Lesco Rate Chart" : rateSource;
    // oak wilt (alamo), product in mL, water in gal
    if (rateSource === "ALAMO") {
        const low = (output?.productLow ?? null);
        const high = (output?.productHigh ?? null);
        const water = (output?.water ?? null);
        const showLow = low == null ? "n/a" : low;
        const showHigh = high == null ? "n/a" : high;
        const showWater = water == null ? "n/a" : water;
        const footer = "Alamo Fungicide - Propiconazole 14.3%";
        return (_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-semibold", children: ["dbh ", dbh, " in"] }), _jsxs("div", { className: "mt-3 text-2xl text-[color:#1F4D33] font-semibold", children: [showLow, " mL (", showHigh, " mL HIGH), Water ", showWater, " gal"] }), _jsx("div", { className: "mt-2 text-sm text-neutral-600", children: footer })] }));
    }
    // arbotect and iron branches
    if ("water" in (output ?? {})) {
        if (rateSource === "ARBOTECT") {
            return (_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-semibold", children: ["dbh ", dbh, " in"] }), _jsxs("div", { className: "mt-3 text-2xl text-[color:#1F4D33] font-semibold", children: [output.product, " oz of Arbotect, water ", output.water, " gal"] }), _jsx("div", { className: "mt-2 text-sm text-neutral-600", children: displayLabel })] }));
        }
        if (rateSource === "IRON") {
            return (_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-semibold", children: ["dbh ", dbh, " in"] }), _jsxs("div", { className: "mt-3 text-2xl text-[color:#1F4D33] font-semibold", children: [output.product, " oz of Iron, water ", output.water, " gal"] }), _jsx("div", { className: "mt-2 text-sm text-neutral-600", children: displayLabel })] }));
        }
    }
    // tree iv fallback
    return (_jsxs("div", { children: [_jsxs("div", { className: "text-2xl font-semibold", children: ["dbh ", dbh, " in"] }), _jsxs("div", { className: "mt-3 text-2xl text-[color:#1F4D33] font-semibold", children: [output.product, " ", output.units] }), _jsx("div", { className: "mt-2 text-sm text-neutral-600", children: displayLabel })] }));
}
