"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

// The inline script in app/layout.tsx applies the saved theme before paint;
// this button flips the class on <html> and remembers the choice.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.classList.contains("dark"), () => false);
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };
  return <button onClick={toggle} className="grid size-9 place-items-center rounded-full border border-line-strong bg-surface text-muted transition hover:bg-nav-hover hover:text-ink" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>
    {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
  </button>;
}
