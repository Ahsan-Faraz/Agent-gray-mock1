"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Fades its children up the first time they scroll into view.
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        observer.disconnect();
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={clsx("reveal", shown && "is-in", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

// Counts up to `value` once visible.
export function CountUp({ value, prefix = "", suffix = "", duration = 1400 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setCurrent(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value, duration]);
  return <span ref={ref} className="tabular-nums">{prefix}{current.toLocaleString("en-US")}{suffix}</span>;
}
