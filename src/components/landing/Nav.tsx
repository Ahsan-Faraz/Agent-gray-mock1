"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Brand } from "@/components/ui";
import { LpButton } from "./LpButton";
import { SECTIONS } from "./sections";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The landing page has a fixed white-and-black design. Drop the app's dark
  // class while it is open and restore the saved theme when leaving.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    return () => {
      try {
        const saved = localStorage.getItem("theme");
        if (saved === "dark" || (!saved && matchMedia("(prefers-color-scheme: dark)").matches)) root.classList.add("dark");
      } catch {}
    };
  }, []);

  return <header className={clsx("lp-dark dark fixed inset-x-0 top-0 z-50 border-b transition-all duration-300", scrolled || open ? "border-white/10 bg-black/80 backdrop-blur-xl" : "border-transparent bg-transparent")}>
    <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6">
      <Link href="/" className="shrink-0 rounded-lg" aria-label="Agent Gray home"><Brand size={34} onDark textClassName="whitespace-nowrap" /></Link>
      <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Sections">
        {SECTIONS.map((item) => <a key={item.href} href={item.href} className="rounded-full px-3.5 py-2 text-sm font-medium text-white/65 transition hover:text-white">{item.label}</a>)}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:text-white sm:block">Log in</Link>
        <span className="hidden sm:block"><LpButton href="/signup" onDark size="md">Get started</LpButton></span>
        <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full border border-white/20 text-white lg:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
    {open && <div className="border-t border-white/10 bg-black px-4 pb-5 pt-2 lg:hidden">
      <nav className="grid" aria-label="Sections">
        {SECTIONS.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-white/10 py-3.5 text-[15px] font-medium text-white">{item.label}</a>)}
      </nav>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <LpButton href="/login" onDark variant="outline" arrow={false} className="w-full">Log in</LpButton>
        <LpButton href="/signup" onDark arrow={false} className="w-full">Get started</LpButton>
      </div>
    </div>}
  </header>;
}
