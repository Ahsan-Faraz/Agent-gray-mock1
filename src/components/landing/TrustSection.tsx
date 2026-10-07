import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import { dateTime, initials } from "@/lib/format";
import type { AuditEvent, TeamMember } from "@/lib/types";
import { Reveal } from "./Reveal";

const PRINCIPLES = [
  { title: "Durable", body: "Server-backed state. Lists, contacts and results persist, so progress is never lost." },
  { title: "Traceable", body: "Evidence history. Calls, snapshots and workspace actions are kept in an audit trail." },
  { title: "Scoped", body: "Workspace access. Each workspace only sees its own contacts, lists and results." },
  { title: "Role-based", body: "Owner, admin, operator and viewer roles decide who can buy credits, run lists or only view." },
];

function Panel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-36px_rgba(21,34,56,0.4)]">
    <div className="border-b border-line px-5 py-4">
      <p className="font-bold text-navy">{title}</p>
      <p className="mt-0.5 text-[13px] text-muted">{description}</p>
    </div>
    {children}
  </div>;
}

// Editorial layout: statement + real product panels, then four numbered principles.
export function TrustSection({ events, members }: { events: AuditEvent[]; members: TeamMember[] }) {
  return <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <Reveal className="lg:pt-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70"><span className="size-1.5 rounded-full bg-brand-500" />Built for teams</p>
        <h2 className="mt-6 text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-navy sm:text-6xl"><span className="text-white/45">Every result has a</span> paper trail</h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">Every list action, CRM sync and role change is recorded with who did it and when, so you can always explain a result.</p>
      </Reveal>

      <Reveal delay={120} className="relative">
        {/* Soft backdrop so the panels read as product screenshots */}
        <div className="absolute -inset-4 -z-10 rounded-[36px] bg-[radial-gradient(closest-side,rgba(79,123,255,0.12),transparent)] sm:-inset-6" aria-hidden="true" />
        <div className="grid gap-4" aria-hidden="true" inert>
          <Panel title="Audit trail" description="Recent configuration, integration, and list actions for this workspace.">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-line text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle"><th className="px-5 py-2.5">Action</th><th className="hidden px-3 py-2.5 sm:table-cell">Resource</th><th className="px-5 py-2.5 text-right">When</th></tr></thead>
              <tbody>{events.slice(0, 5).map((event) => <tr key={event.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3"><code className="font-mono text-[12px] font-semibold text-navy">{event.action}</code></td>
                <td className="hidden px-3 py-3 text-muted sm:table-cell">{event.resource_type} {event.resource_id}</td>
                <td className="whitespace-nowrap px-5 py-3 text-right text-muted">{dateTime(event.created_at).replace(/, \d{4}/, "")}</td>
              </tr>)}</tbody>
            </table>
          </Panel>
          <Panel title="Team access" description="Workspace membership and role changes are server-authorized.">
            <ul className="grid sm:grid-cols-2">
              {members.map((member) => <li key={member.user_id} className="flex items-center gap-3 border-b border-line px-5 py-3 sm:odd:border-r [&:nth-last-child(-n+2)]:sm:border-b-0 last:border-b-0">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-ink">{initials(member.username)}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-navy">{member.username}</span><span className="block truncate text-xs text-muted">{member.email}</span></span>
                <StatusBadge value={member.role} />
              </li>)}
            </ul>
          </Panel>
        </div>
      </Reveal>
    </div>

    <ol className="mt-20 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {PRINCIPLES.map((item, index) => <li key={item.title} className="border-b border-line py-8 sm:pr-6 sm:even:border-l sm:even:pl-6 lg:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
        <Reveal delay={index * 80}>
          <span className="font-mono text-sm text-white/40">0{index + 1}</span>
          <h3 className="mt-4 text-xl font-medium tracking-tight text-navy">{item.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
        </Reveal>
      </li>)}
    </ol>
  </section>;
}
