import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

// Landing buttons: a pill with an arrow chip. "solid" is black on white
// sections and white on black sections; "outline" is the quiet partner.
type Props = ComponentProps<typeof Link> & { variant?: "solid" | "outline"; onDark?: boolean; arrow?: boolean; size?: "md" | "lg" };

export function lpButtonClass({ variant = "solid", onDark = false, size = "lg" }: { variant?: "solid" | "outline"; onDark?: boolean; size?: "md" | "lg" } = {}) {
  return clsx(
    "group/btn inline-flex items-center justify-center gap-3 rounded-full font-semibold transition-all duration-300 active:scale-[0.98]",
    size === "lg" ? "h-12 pl-6 pr-1.5 text-[15px]" : "h-10 pl-5 pr-1 text-sm",
    variant === "solid" && (onDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"),
    variant === "outline" && (onDark ? "border border-white/25 text-white hover:border-white/60 hover:bg-white/5" : "border border-black/15 text-black hover:border-black/50"),
  );
}

export function LpButton({ variant = "solid", onDark = false, arrow = true, size = "lg", className, children, ...props }: Props) {
  return <Link className={clsx(lpButtonClass({ variant, onDark, size }), !arrow && (size === "lg" ? "pr-6" : "pr-5"), className)} {...props}>
    {children}
    {arrow && <span className={clsx("grid place-items-center rounded-full transition-transform duration-300 group-hover/btn:translate-x-0.5", size === "lg" ? "size-9" : "size-8",
      variant === "solid" ? (onDark ? "bg-black text-white" : "bg-white text-black") : (onDark ? "bg-white text-black" : "bg-black text-white"))}>
      <ArrowRight size={16} aria-hidden="true" />
    </span>}
  </Link>;
}
