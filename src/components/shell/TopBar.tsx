"use client";

import clsx from "clsx";
import { ChevronDown, Coins, CreditCard, LifeBuoy, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/ui";
import { initials, number } from "@/lib/format";
import type { User } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";

const MENU_ITEMS = [
  { href: "/profile/settings", label: "Settings", icon: Settings },
  { href: "/profile/billing", label: "Billing", icon: CreditCard },
  { href: "/help", label: "Help center", icon: LifeBuoy },
];

function ProfileMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); }

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, [open]);

  return <div className="relative" ref={ref}>
    <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-1.5 rounded-full border border-line-strong bg-surface p-0.5 transition hover:bg-nav-hover sm:pr-2" aria-haspopup="menu" aria-expanded={open} aria-label="Account menu">
      <span className="grid size-8 place-items-center rounded-full bg-brand-100 text-[13px] font-bold text-brand-ink">{initials(user.name)}</span>
      <ChevronDown size={15} className={clsx("hidden text-muted transition sm:block", open && "rotate-180")} aria-hidden="true" />
    </button>
    {/* Solid surface (not glass) so page content never shows through the menu text. */}
    {open && <div role="menu" className="absolute right-0 top-12 z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_40px_rgba(20,32,52,0.16)]">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-ink">{initials(user.name)}</span>
        <div className="min-w-0">
          <strong className="block truncate text-sm text-navy">{user.name}</strong>
          <span className="block truncate text-[13px] text-muted">{user.email}</span>
        </div>
      </div>
      <div className="p-1.5">
        {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return <Link key={href} role="menuitem" href={href} className={clsx("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm", active ? "bg-brand-50 font-semibold text-brand-ink" : "text-ink hover:bg-nav-hover")}>
            <Icon size={16} className={active ? "" : "text-muted"} aria-hidden="true" />{label}
          </Link>;
        })}
        <div className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm sm:hidden">
          <span>Appearance</span><ThemeToggle />
        </div>
      </div>
      <div className="border-t border-line p-1.5">
        <Link role="menuitem" href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-bad-ink hover:bg-bad-soft">
          <LogOut size={16} aria-hidden="true" />Sign out
        </Link>
      </div>
    </div>}
  </div>;
}

export function TopBar({ user, credits }: { user: User; credits: number }) {
  return <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-[0_1px_3px_rgba(16,24,40,0.05)]">
    <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="rounded-lg" aria-label="Agent Gray home"><Brand size={32} className="md:[&>[role=img]]:hidden" textClassName="text-xl" /></Link>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link href="/profile/billing" className="flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 text-sm text-muted transition hover:bg-nav-hover" aria-label="View credits and billing">
          <Coins size={16} className="text-brand-ink" aria-hidden="true" />
          <strong className="tabular-nums text-ink">{number(credits)}</strong>
          <span className="hidden sm:inline">credits</span>
        </Link>
        <span className="hidden sm:block"><ThemeToggle /></span>
        <ProfileMenu user={user} />
      </div>
    </div>
  </header>;
}
