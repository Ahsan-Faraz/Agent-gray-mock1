"use client";

import clsx from "clsx";
import { Plus } from "lucide-react";
import { useState } from "react";

// Hairline accordion: one open answer at a time, plus sign turns into a cross.
export function Faq({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="border-t border-black/10">
    {items.map((item, index) => {
      const on = open === index;
      return <div key={item.q} className="border-b border-black/10">
        <h3>
          <button onClick={() => setOpen(on ? null : index)} aria-expanded={on} className="group flex w-full items-center gap-6 py-6 text-left text-lg font-medium tracking-tight text-black">
            <span className="flex-1 transition-colors group-hover:text-black/70">{item.q}</span>
            <span className={clsx("grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300", on ? "rotate-45 border-black bg-black text-white" : "border-black/15 text-black")}><Plus size={16} aria-hidden="true" /></span>
          </button>
        </h3>
        <div className={clsx("grid transition-[grid-template-rows] duration-300 ease-out", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
          </div>
        </div>
      </div>;
    })}
  </div>;
}
