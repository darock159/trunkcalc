import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateRate } from "../lib/calculateRate";
import { rateSourceFor, inferInjection, treeTypes, TreeType } from "../lib/datasets";
import { useAppStore } from "../store/useAppStore";
import { useEffect } from "react";

const schema = z.object({
  treeType: z.enum(["Ash","Elm","Sycamore","Oak","Birch"]),
  dbh: z
    .string()
    .min(1, "required")
    .refine(v => !Number.isNaN(Number(v)), "enter a number")
    .refine(v => Number(v) > 0, "must be positive")
});
type FormValues = z.infer<typeof schema>;

export default function Calculator() {
  const setResult = useAppStore(s => s.setResult);
  const clearResult = useAppStore(s => s.clearResult);
  const result = useAppStore(s => s.lastResult);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { treeType: "Ash", dbh: "" }
  });

  const dbhWatch = watch("dbh");
  useEffect(() => {
    if (dbhWatch === "") {
      clearResult();
    }
  }, [dbhWatch, clearResult]);

  function onSubmit(values: FormValues) {
    const rounded = Math.round(Number(values.dbh));
    const tree: TreeType = values.treeType;
    const inj = inferInjection(tree);
    const source = rateSourceFor(tree, inj);
    const out = calculateRate(rounded, tree, inj);
    setResult({
      input: { treeType: tree, injectionType: inj, dbhOriginal: rounded, dbhUnit: "in", dbhRoundedInches: rounded },
      output: out, rateSource: source
    });
    (document.activeElement as HTMLElement | null)?.blur();
  }

  function onClear() {
    reset({ dbh: "", treeType: watch("treeType") });
    clearResult();
  }

  return (
    <div>
      <div className="card p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <div className="text-xl font-medium">Manual Entry DBH</div>

          {/* dbh input + clear button to the right */}
          <div className="flex items-center gap-3">
            <input
              inputMode="numeric"
              className="input flex-1"
              placeholder="e.g., 19"
              {...register("dbh")}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") onClear();
                else setValue("dbh", v, { shouldValidate: false });
              }}
            />
            <button type="button" className="btn btn-outline" onClick={onClear} aria-label="clear">
              clear
            </button>
          </div>

          <label className="text-sm">Enter DBH</label>
          {errors.dbh ? <p className="text-sm text-red-600">{errors.dbh.message}</p> : null}

          <button className="btn btn-primary" type="submit">calculate</button>

          <select className="select" {...register("treeType")}>
            {treeTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </form>
      </div>

      <div className="mt-4 card p-6 text-center min-h-[180px] flex items-center justify-center">
        {result ? (
          ("notRecommended" in (result.output as any)) ? (
            <div>
              <div className="text-2xl font-semibold">dbh {result.input.dbhRoundedInches} in</div>
              <div className="mt-3 text-red-700 font-semibold">
                not recommended, elm under 10 inches should not be treated
              </div>
              <div className="mt-2 text-sm text-neutral-600">{result.rateSource}</div>
            </div>
          ) : (
            <OutputBlock
              dbh={result.input.dbhRoundedInches}
              rateSource={result.rateSource}
              output={result.output as any}
            />
          )
        ) : (
          <div className="text-neutral-500">results will appear here</div>
        )}
      </div>
    </div>
  );
}

function OutputBlock({
  dbh, rateSource, output
}: {
  dbh: number;
  rateSource: "TREE IV" | "ARBOTECT" | "IRON";
  output: any;
}) {
  if ("water" in output) {
    if (rateSource === "ARBOTECT") {
      return (
        <div>
          <div className="text-2xl font-semibold">dbh {dbh} in</div>
          <div className="mt-3 text-2xl text-[color:#1F4D33] font-semibold">
            {output.product} oz of Arbotect, water {output.water} gal
          </div>
          <div className="mt-2 text-sm text-neutral-600">{rateSource}</div>
        </div>
      );
    }
    if (rateSource === "IRON") {
      return (
        <div>
          <div className="text-2xl font-semibold">dbh {dbh} in</div>
          <div className="mt-3 text-2xl text-[color:#1F4D33] font-semibold">
            {output.product} oz of Iron, water {output.water} gal
          </div>
          <div className="mt-2 text-sm text-neutral-600">{rateSource}</div>
        </div>
      );
    }
  }
  return (
    <div>
      <div className="text-2xl font-semibold">dbh {dbh} in</div>
      <div className="mt-3 text-2xl text-[color:#1F4D33] font-semibold">
        {output.product} {output.units}
      </div>
      <div className="mt-2 text-sm text-neutral-600">{rateSource}</div>
    </div>
  );
}
