"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Faq({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="grid gap-3">
    {items.map((item, index) => {
      const on = open === index;
      return <div key={item.q} className={clsx("rounded-2xl border bg-surface transition-all duration-300", on ? "border-brand-200 shadow-[var(--shadow-card)]" : "border-line")}>
        <h3>
          <button onClick={() => setOpen(on ? null : index)} aria-expanded={on} className="flex w-full items-center gap-4 px-5 py-4 text-left text-[15px] font-semibold text-navy sm:px-6 sm:py-5">
            <span className="flex-1">{item.q}</span>
            <ChevronDown size={18} className={clsx("shrink-0 text-muted transition-transform duration-300", on && "rotate-180 text-brand-ink")} aria-hidden="true" />
          </button>
        </h3>
        <div className={clsx("grid transition-[grid-template-rows] duration-300 ease-out", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{item.a}</p>
          </div>
        </div>
      </div>;
    })}
  </div>;
}
