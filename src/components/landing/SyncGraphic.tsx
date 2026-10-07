import clsx from "clsx";
import { ArrowDown, Tags } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui";
import { AttioMark, CsvMark, HighLevelMark, HubSpotMark } from "./BrandLogos";

// Contacts flow in from the left, Agent Gray verifies them in the middle, and
// results flow back out to the CRMs on the right. Coordinates share a
// 1000 x 460 frame so the HTML nodes line up with the SVG beams.
const W = 1000;
const H = 460;
const HUB = { x: 500, y: 230 };

const INPUTS = [
  { id: "in-hs", Mark: HubSpotMark, label: "HubSpot", x: 120, y: 70 },
  { id: "in-ghl", Mark: HighLevelMark, label: "GoHighLevel", x: 70, y: 180 },
  { id: "in-at", Mark: AttioMark, label: "Attio", x: 70, y: 290 },
  { id: "in-csv", Mark: CsvMark, label: "CSV", x: 120, y: 400 },
];
const OUTPUTS = [
  { id: "out-hs", Mark: HubSpotMark, label: "Result export", x: 860, y: 95 },
  { id: "out-ghl", Mark: HighLevelMark, label: "Outcome tags", x: 920, y: 230 },
  { id: "out-at", Mark: AttioMark, label: "Result export", x: 860, y: 365 },
];

const curve = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const mid = (from.x + to.x) / 2;
  return `M${from.x} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${to.x} ${to.y}`;
};

function Node({ x, y, children, className }: { x: number; y: number; children: ReactNode; className?: string }) {
  return <div className={clsx("absolute -translate-x-1/2 -translate-y-1/2", className)} style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}>{children}</div>;
}

const OUTCOMES = ["Verified", "Wrong person", "No engagement", "Verified"];

export function SyncGraphic() {
  return <>
    {/* Tablet and desktop: the full flow diagram */}
    <div className="relative mx-auto hidden aspect-[1000/460] w-full max-w-5xl md:block" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="beam-in" gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="430" y2="0"><stop offset="0" stopColor="var(--brand-500)" stopOpacity="0.15" /><stop offset="1" stopColor="var(--brand-500)" stopOpacity="0.7" /></linearGradient>
          <linearGradient id="beam-out" gradientUnits="userSpaceOnUse" x1="570" y1="0" x2="900" y2="0"><stop offset="0" stopColor="var(--good)" stopOpacity="0.7" /><stop offset="1" stopColor="var(--good)" stopOpacity="0.15" /></linearGradient>
          <filter id="dot-glow" x="-2" y="-2" width="5" height="5"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        {INPUTS.map((node) => <path key={node.id} id={node.id} d={curve({ x: node.x + 40, y: node.y }, { x: HUB.x - 70, y: HUB.y })} fill="none" stroke="url(#beam-in)" strokeWidth="2" strokeDasharray="5 7" style={{ animation: "flow-dash 1.4s linear infinite" }} />)}
        {OUTPUTS.map((node) => <path key={node.id} id={node.id} d={curve({ x: HUB.x + 70, y: HUB.y }, { x: node.x - 40, y: node.y })} fill="none" stroke="url(#beam-out)" strokeWidth="2" strokeDasharray="5 7" style={{ animation: "flow-dash 1.4s linear infinite" }} />)}
        {INPUTS.map((node, index) => <g key={`dot-${node.id}`}>
          <circle r="7" fill="var(--brand-500)" opacity="0.5" filter="url(#dot-glow)"><animateMotion dur="2.6s" begin={`${index * 0.55}s`} repeatCount="indefinite"><mpath href={`#${node.id}`} /></animateMotion></circle>
          <circle r="3.5" fill="var(--brand-500)"><animateMotion dur="2.6s" begin={`${index * 0.55}s`} repeatCount="indefinite"><mpath href={`#${node.id}`} /></animateMotion></circle>
        </g>)}
        {OUTPUTS.map((node, index) => <g key={`dot-${node.id}`}>
          <circle r="7" fill="var(--good)" opacity="0.5" filter="url(#dot-glow)"><animateMotion dur="2.6s" begin={`${1.3 + index * 0.6}s`} repeatCount="indefinite"><mpath href={`#${node.id}`} /></animateMotion></circle>
          <circle r="3.5" fill="var(--good)"><animateMotion dur="2.6s" begin={`${1.3 + index * 0.6}s`} repeatCount="indefinite"><mpath href={`#${node.id}`} /></animateMotion></circle>
        </g>)}
      </svg>

      <p className="absolute left-0 top-0 text-xs font-bold uppercase tracking-[0.12em] text-subtle">Import contacts</p>
      <p className="absolute right-0 top-0 text-xs font-bold uppercase tracking-[0.12em] text-subtle">Send results back</p>

      {INPUTS.map(({ id, Mark, label, x, y }, index) => <Node key={id} x={x} y={y}>
        <span className="float-y flex items-center gap-2.5 rounded-2xl border border-line bg-surface py-2 pl-2 pr-3.5 shadow-[var(--shadow-card)]" style={{ animationDelay: `${index * -1.1}s` }}>
          <span className="grid size-10 place-items-center rounded-xl bg-surface-2 p-2"><Mark className="size-full" /></span>
          <span className="text-sm font-semibold text-navy">{label}</span>
        </span>
      </Node>)}

      {OUTPUTS.map(({ id, Mark, label, x, y }, index) => <Node key={id} x={x} y={y}>
        <span className="float-y flex items-center gap-2.5 rounded-2xl border border-line bg-surface py-2 pl-2 pr-3.5 shadow-[var(--shadow-card)]" style={{ animationDelay: `${index * -1.4 - 0.5}s` }}>
          <span className="grid size-10 place-items-center rounded-xl bg-surface-2 p-2"><Mark className="size-full" /></span>
          <span className="whitespace-nowrap text-sm font-semibold text-navy">{label}</span>
          {label === "Outcome tags" && <Tags size={14} className="text-good-ink" />}
        </span>
      </Node>)}

      {/* The hub */}
      <Node x={HUB.x} y={HUB.y}>
        <div className="relative grid place-items-center">
          {[0, 1, 2].map((ring) => <span key={ring} className="absolute size-36 rounded-full border border-brand-500/40" style={{ animation: `ring-out 3.6s ease-out ${ring * 1.2}s infinite` }} />)}
          <span className="absolute size-56 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="relative grid size-36 place-items-center rounded-[36px] border border-white/60 bg-linear-to-b from-surface to-brand-50 shadow-[0_30px_60px_-20px_rgba(49,94,234,0.55),inset_0_1px_0_rgba(255,255,255,0.8)]">
            <span className="absolute inset-[6px] rounded-[30px] border border-brand-100" />
            <LogoMark size={64} />
          </div>
          <div className="absolute top-[calc(100%+18px)] flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-navy shadow-[var(--shadow-card)]">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-brand-500" /></span>
            <span className="text-muted">Verifying</span>
            <span className="h-4 overflow-hidden"><span className="block" style={{ animation: "ticker 8s cubic-bezier(0.6,0,0.2,1) infinite" }}>{OUTCOMES.map((outcome, index) => <span key={index} className={clsx("block h-4 leading-4", outcome === "Verified" ? "text-good-ink" : outcome === "Wrong person" ? "text-bad-ink" : "text-warn-ink")}>{outcome}</span>)}</span></span>
          </div>
        </div>
      </Node>
    </div>

    {/* Phones: a stacked version of the same flow */}
    <div className="mx-auto grid max-w-sm justify-items-center gap-4 md:hidden" aria-hidden="true">
      <div className="flex gap-3">{INPUTS.map(({ id, Mark }) => <span key={id} className="grid size-14 place-items-center rounded-2xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]"><Mark className="size-full" /></span>)}</div>
      <ArrowDown size={20} className="animate-bounce text-brand-ink" />
      <div className="grid size-28 place-items-center rounded-[30px] border border-line bg-linear-to-b from-surface to-brand-50 shadow-[0_24px_48px_-20px_rgba(49,94,234,0.55)]"><LogoMark size={52} /></div>
      <ArrowDown size={20} className="animate-bounce text-good-ink" />
      <div className="flex flex-wrap justify-center gap-2">
        {["Result export", "Outcome tags"].map((label) => <span key={label} className="rounded-full bg-good-soft px-3 py-1.5 text-xs font-semibold text-good-ink">{label}</span>)}
      </div>
    </div>
  </>;
}
