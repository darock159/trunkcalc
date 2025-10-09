
import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import Calculator from "./components/Calculator";
import MenuSheet from "./components/MenuSheet";

export default function App() {
  const init = useAppStore(s => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <div className="safe mx-auto max-w-md p-4 pb-28">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/icons/ryan-urban-forestry.png"
            alt="Ryan Urban Forestry"
            className="h-12 w-auto"
          />
          <span className="text-2xl font-semibold text-[#1F4D33] leading-none">TrunkCalc</span>
        </div>
        <MenuSheet />
      </header>

      <Calculator />

      <div className="fixedbar">
        <div className="mx-auto max-w-md p-3">
          <p className="text-xs text-neutral-600">install from browser menu to add to home screen.</p>
        </div>
      </div>
    </div>
  );
}
