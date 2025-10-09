import { useState } from "react";

export default function MenuSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button aria-label="menu" className="menu-hitbox" onClick={() => setOpen(o => !o)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="5" cy="12" r="2" fill="#1F4D33"/><circle cx="12" cy="12" r="2" fill="#1F4D33"/><circle cx="19" cy="12" r="2" fill="#1F4D33"/>
        </svg>
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow">
          <div className="px-3 py-2 text-sm text-neutral-600">coming soon</div>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100">view rate charts</button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100">high contrast mode</button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100">about</button>
        </div>
      ) : null}
    </div>
  );
}