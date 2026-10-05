"use client";

import clsx from "clsx";
import { LayoutDashboard, LifeBuoy, ListChecks, Plug, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/ui";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lists", label: "Lists", icon: ListChecks },
  { href: "/integrations", label: "Integrations", icon: Plug },
];

function RailLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof Plug; active: boolean }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className="group relative flex w-full flex-col items-center gap-1.5 py-1">
    {/* Accent bar on the rail edge marks the current page. */}
    <span className={clsx("absolute -left-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full transition-all", active ? "bg-brand-500" : "h-0 bg-transparent")} aria-hidden="true" />
    <span className={clsx(
      "grid size-11 place-items-center rounded-xl border transition-all",
      active
        ? "border-brand-500 bg-brand-600 text-white shadow-[0_6px_16px_rgba(49,94,234,0.28)]"
        : "border-line bg-surface text-nav group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-ink",
    )}>
      <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
    </span>
    <span className={clsx("text-[11px] font-semibold leading-none", active ? "text-brand-ink" : "text-nav group-hover:text-navy")}>{label}</span>
  </Link>;
}

export function Sidebar() {
  const pathname = usePathname();
  return <aside className="glass fixed inset-y-0 left-0 z-30 hidden w-[92px] flex-col items-center border-r border-line px-3 py-4 md:flex" aria-label="Sidebar">
    <Link href="/dashboard" className="rounded-xl p-1" aria-label="Agent Gray home"><LogoMark size={44} /></Link>
    <div className="my-4 h-px w-10 bg-line" aria-hidden="true" />
    <nav className="flex w-full flex-col items-center gap-4" aria-label="Main">
      {NAV_ITEMS.map((item) => <RailLink key={item.href} {...item} active={pathname.startsWith(item.href)} />)}
    </nav>
    <Link href="/lists/new" className="mt-6 grid size-11 place-items-center rounded-full border border-dashed border-brand-500 text-brand-ink transition hover:bg-brand-50" aria-label="New list" title="New list">
      <Plus size={20} aria-hidden="true" />
    </Link>
    <div className="mt-auto w-full">
      <RailLink href="/help" label="Help" icon={LifeBuoy} active={pathname.startsWith("/help")} />
    </div>
  </aside>;
}

// Phones: the rail becomes a bottom tab bar within thumb reach.
export function BottomNav() {
  const pathname = usePathname();
  const items = [...NAV_ITEMS, { href: "/profile/settings", label: "Account", icon: UserRound }];
  return <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t border-line pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Main">
    <div className="mx-auto grid max-w-md grid-cols-4">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href) || (href === "/profile/settings" && (pathname.startsWith("/profile") || pathname.startsWith("/help")));
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={clsx("flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold", active ? "text-brand-ink" : "text-nav")}>
          <span className={clsx("grid h-7 w-12 place-items-center rounded-full transition", active && "bg-brand-50")}><Icon size={19} aria-hidden="true" /></span>
          {label}
        </Link>;
      })}
    </div>
  </nav>;
}
