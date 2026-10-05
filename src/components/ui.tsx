import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { BRAND, humanize } from "@/lib/format";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md";

const buttonBase = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";
const buttonVariant: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  outline: "border border-brand-500 text-brand-ink bg-surface hover:bg-brand-50",
  ghost: "border border-line-strong bg-surface text-ink hover:bg-nav-hover",
  danger: "border border-bad/40 bg-surface text-bad-ink hover:bg-bad-soft",
};
const buttonSize: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-sm",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return clsx(buttonBase, buttonVariant[variant], buttonSize[size], className);
}

export function Button({ variant = "primary", size = "md", className, ...props }: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

export function Card({ className, ...props }: ComponentProps<"section">) {
  return <section className={clsx("rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)]", className)} {...props} />;
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
    <div>
      <h2 className="text-[15px] font-bold text-navy">{title}</h2>
      {description && <p className="mt-0.5 text-[13px] text-muted">{description}</p>}
    </div>
    {action}
  </div>;
}

export function PageHeader({ title, eyebrow, description, actions, back }: { title: string; eyebrow?: string; description?: string; actions?: ReactNode; back?: ReactNode }) {
  return <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0">
      {back}
      {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">{eyebrow}</p>}
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">{title}</h1>
      {description && <p className="mt-1 text-[15px] text-muted">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </header>;
}

export function Logo({ className }: { className?: string }) {
  return <span className={clsx("text-lg tracking-tight text-navy", className)}>{BRAND.first} <strong className="font-extrabold">{BRAND.second}</strong></span>;
}

// The uploaded logo (public/logo.png) converted to a transparency mask
// (public/logo-mark.png), so the exact shape takes the theme's colors:
// brand blue to navy in light mode, light blue to white in dark mode.
export function LogoMark({ size = 36, onDark = false, className }: { size?: number; onDark?: boolean; className?: string }) {
  return <span
    role="img"
    aria-label={BRAND.name}
    className={clsx("inline-block shrink-0 bg-linear-to-br", onDark ? "from-[#dfe5ff] to-[#9cb0ec]" : "from-brand-500 to-navy", className)}
    style={{ width: size, height: size, mask: "url(/logo-mark.png) center / contain no-repeat", WebkitMask: "url(/logo-mark.png) center / contain no-repeat" }}
  />;
}

export function Brand({ size = 34, onDark = false, className, textClassName }: { size?: number; onDark?: boolean; className?: string; textClassName?: string }) {
  return <span className={clsx("inline-flex items-center gap-2.5", className)}>
    <LogoMark size={size} onDark={onDark} />
    <Logo className={clsx(onDark && "text-white", textClassName)} />
  </span>;
}

const toneClass = {
  good: "bg-good-soft text-good-ink",
  warn: "bg-warn-soft text-warn-ink",
  bad: "bg-bad-soft text-bad-ink",
  brand: "bg-brand-50 text-brand-ink",
  purple: "bg-purple-soft text-purple-ink",
  neutral: "bg-neutral-soft text-neutral-ink",
} as const;
export type Tone = keyof typeof toneClass;

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={clsx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", toneClass[tone])}>
    <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
    {children}
  </span>;
}

// Same status groups as the original's .status-* classes.
const TONES: Array<[Tone, string[]]> = [
  ["good", ["completed", "confirmed", "processed", "connected", "healthy", "verified", "paid", "p1 - likely answer"]],
  ["brand", ["running", "queued", "processing", "answered", "created", "scheduled", "scheduled_starting", "waiting_for_numbers", "checkout_pending", "pending"]],
  ["bad", ["failed", "wrong_person", "disconnected", "reconnect required", "busy"]],
  ["warn", ["cancelled", "needs_review", "review", "retrying", "needs attention", "no_engagement", "no-answer", "refunded", "p3 - likely unreachable"]],
  ["purple", ["voicemail", "gatekeeper", "p2 - likely voicemail"]],
];

export function toneFor(value: string | null | undefined): Tone {
  const key = (value || "unknown").toLowerCase();
  return TONES.find(([, values]) => values.includes(key))?.[0] ?? "neutral";
}

export function StatusBadge({ value, label }: { value: string | null | undefined; label?: string }) {
  return <Badge tone={toneFor(value)}>{label ?? humanize(value)}</Badge>;
}

export function Progress({ value, className }: { value: number; className?: string }) {
  const width = Math.max(0, Math.min(100, value));
  return <div className={clsx("h-2 overflow-hidden rounded-full bg-brand-100", className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={width}>
    <div className="h-full rounded-full bg-brand-500" style={{ width: `${width}%` }} />
  </div>;
}

export function StatCard({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon?: ReactNode }) {
  return <Card className="p-5">
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      {icon && <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-ink">{icon}</span>}
    </div>
    <strong className="mt-2 block text-[28px] font-bold leading-tight tracking-tight text-navy tabular-nums">{value}</strong>
    {hint && <span className="mt-1 block text-[13px] text-muted">{hint}</span>}
  </Card>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-sm">
    <span className="font-semibold">{label}</span>
    {children}
    {hint && <span className="text-[13px] text-muted">{hint}</span>}
  </label>;
}

export const inputClass = "h-11 w-full rounded-xl border border-subtle/70 bg-surface px-3.5 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:bg-canvas";

export function EmptyState({ title, description, action, icon }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) {
  return <div className="grid place-items-center px-6 py-14 text-center">
    {icon && <span className="mb-3 grid size-12 place-items-center rounded-full bg-brand-50 text-brand-ink">{icon}</span>}
    <h3 className="font-bold">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>;
}

export const th = "px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted";
export const td = "px-5 py-3.5 align-middle";
