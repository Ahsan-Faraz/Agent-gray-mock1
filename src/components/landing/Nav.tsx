"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { Brand, buttonClass } from "@/components/ui";
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

  return <header className={clsx("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled || open ? "glass border-b border-line shadow-[0_8px_30px_-20px_rgba(16,24,40,0.35)]" : "border-b border-transparent")}>
    <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6">
      <Link href="/" className="shrink-0 rounded-lg" aria-label="Agent Gray home"><Brand size={34} textClassName="whitespace-nowrap" /></Link>
      <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Sections">
        {SECTIONS.map((item) => <a key={item.href} href={item.href} className="rounded-full px-3.5 py-2 text-sm font-medium text-nav transition hover:bg-nav-hover hover:text-navy">{item.label}</a>)}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-navy transition hover:bg-nav-hover sm:block">Log in</Link>
        <span className="hidden sm:block"><Link href="/signup" className={buttonClass("primary", "md", "rounded-full")}>Get started</Link></span>
        <button onClick={() => setOpen(!open)} className="grid size-9 place-items-center rounded-full border border-line-strong bg-surface text-ink lg:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
    {open && <div className="border-t border-line bg-surface px-4 pb-5 pt-2 lg:hidden">
      <nav className="grid" aria-label="Sections">
        {SECTIONS.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-line py-3.5 text-[15px] font-semibold text-navy">{item.label}</a>)}
      </nav>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href="/login" className={buttonClass("ghost", "md", "h-11 rounded-full")}>Log in</Link>
        <Link href="/signup" className={buttonClass("primary", "md", "h-11 rounded-full")}>Get started</Link>
      </div>
    </div>}
  </header>;
}
