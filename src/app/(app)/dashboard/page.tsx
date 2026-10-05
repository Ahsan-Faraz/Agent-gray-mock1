import { ArrowRight, ArrowUpRight, ContactRound, Layers3, PhoneCall, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar, Donut, Hero, Ring } from "@/components/premium";
import { ReportButton } from "@/components/ReportButton";
import { ButtonLink, Card, EmptyState, PageHeader, StatusBadge, toneFor } from "@/components/ui";
import { getCalls, getContacts, getLists } from "@/lib/api";
import { date, dateTime, humanize, number, percent } from "@/lib/format";

export const metadata = { title: "Dashboard · Agent Gray" };

export default async function DashboardPage() {
  const [lists, { calls, total: callTotal }, { totals }] = await Promise.all([getLists(), getCalls(), getContacts()]);
  const liveCalls = calls.filter((call) => call.telephony_provider && call.telephony_provider !== "simulated").slice(0, 6);
  const liveLists = lists.filter((list) => list.run_mode === "live").slice(0, 5);
  const running = lists.filter((list) => list.status === "running");
  const scheduled = lists.filter((list) => list.status === "scheduled").length;
  const active = running[0];

  const results = lists.reduce((sum, list) => ({
    verified: sum.verified + list.verified_count,
    noEngagement: sum.noEngagement + list.no_engagement_count,
    wrongPerson: sum.wrongPerson + list.wrong_person_count,
    failures: sum.failures + list.failure_count,
  }), { verified: 0, noEngagement: 0, wrongPerson: 0, failures: 0 });
  const processed = results.verified + results.noEngagement + results.wrongPerson + results.failures;
  const segments = [
    { label: "Verified", value: results.verified, color: "var(--good)" },
    { label: "No engagement", value: results.noEngagement, color: "var(--warn)" },
    { label: "Wrong person", value: results.wrongPerson, color: "var(--bad)" },
    { label: "Failures", value: results.failures, color: "var(--subtle)" },
  ];

  const heroStats = [
    { label: "Contacts", value: totals.all, icon: ContactRound, foot: `${number(totals.newContacts)} new · ${number(totals.processed)} processed` },
    { label: "Lists", value: lists.length, icon: Layers3, foot: `${running.length} running · ${scheduled} scheduled` },
    { label: "Call attempts", value: callTotal, icon: PhoneCall, foot: `${number(processed)} processed contacts` },
  ];

  return <>
    <PageHeader title="Dashboard" description="See what is running and what needs your attention." actions={<>
      <ReportButton lists={lists} />
      <ButtonLink href="/lists/new"><Plus size={16} aria-hidden="true" /> New list</ButtonLink>
    </>} />

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      <Hero className="rise p-6 sm:p-7">
        <p className="text-sm font-medium text-white/75">Workspace</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {heroStats.map(({ label, value, icon: Icon, foot }) => <div key={label}>
            <span className="flex items-center gap-2 text-sm text-white/80"><span className="grid size-7 place-items-center rounded-lg bg-white/15"><Icon size={15} aria-hidden="true" /></span>{label}</span>
            <strong className="mt-3 block text-[40px] font-bold leading-none tracking-tight tabular-nums">{number(value)}</strong>
            <span className="mt-2 block text-[13px] text-white/70">{foot}</span>
          </div>)}
        </div>
        {active && <Link href={`/lists/${active.id}`} className="group mt-7 flex items-center gap-4 rounded-2xl bg-white/12 px-4 py-3.5 ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/18">
          <span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7be0b6] opacity-60" /><span className="relative inline-flex size-2.5 rounded-full bg-[#7be0b6]" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{active.name}</span>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full bg-white" style={{ width: `${active.progress_percent}%` }} /></span>
          </span>
          <span className="text-right text-sm"><strong className="block tabular-nums">{active.progress_percent}%</strong><span className="text-xs text-white/70">{number(active.processed_count)} / {number(active.contact_count)}</span></span>
          <ArrowRight size={18} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>}
      </Hero>

      <Card className="rise flex flex-col p-6 [animation-delay:80ms]">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-navy">Results</h2>
          <Link href="/lists" className="grid size-8 place-items-center rounded-full border border-line text-muted transition hover:border-brand-200 hover:text-brand-ink" aria-label="View lists"><ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="mt-4 flex flex-1 flex-col items-center gap-6 sm:flex-row">
          <Donut segments={segments} center={<strong className="block text-3xl font-bold tabular-nums text-navy">{percent(results.verified, processed)}%</strong>} caption="Verified" />
          <ul className="grid w-full gap-3 text-sm">
            {segments.map((segment) => <li key={segment.label} className="flex items-center gap-3">
              <span className="size-2.5 rounded-full" style={{ background: segment.color }} aria-hidden="true" />
              <span className="flex-1 text-muted">{segment.label}</span>
              <strong className="tabular-nums text-navy">{number(segment.value)}</strong>
              <span className="w-10 text-right text-xs tabular-nums text-muted">{percent(segment.value, processed)}%</span>
            </li>)}
          </ul>
        </div>
      </Card>

      <Card className="rise overflow-hidden [animation-delay:140ms]">
        <div className="flex items-center justify-between gap-3 px-6 pb-2 pt-5">
          <h2 className="text-[15px] font-bold text-navy">Recent calls</h2>
        </div>
        {liveCalls.length === 0 ? <EmptyState title="No calls yet" description="Live calls will appear here after a list creates call attempts." action={<ButtonLink size="sm" href="/lists/new">Create a list</ButtonLink>} /> : <ul className="px-3 pb-3">
          {liveCalls.map((call) => <li key={call.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-nav-hover">
            <Avatar name={call.contact_name} tone={toneFor(call.call_status)} />
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-sm font-semibold text-navy">{call.contact_name || "Unknown contact"}</strong>
              <span className="block truncate text-xs text-muted">{call.phone_e164 || "Phone unavailable"} · {call.final_disposition ? humanize(call.final_disposition) : "—"}</span>
            </div>
            <span className="hidden text-xs tabular-nums text-muted md:block">{dateTime(call.updated_at)}</span>
            <StatusBadge value={call.call_status} />
          </li>)}
        </ul>}
      </Card>

      <Card className="rise overflow-hidden [animation-delay:200ms]">
        <div className="flex items-center justify-between gap-3 px-6 pb-2 pt-5">
          <h2 className="text-[15px] font-bold text-navy">Recent lists</h2>
          <Link href="/lists" className="text-sm font-semibold text-brand-ink hover:underline">View lists</Link>
        </div>
        {liveLists.length === 0 ? <EmptyState title="No live lists yet" description="Live lists will appear here after you create one." /> : <ul className="px-3 pb-3">
          {liveLists.map((list) => <li key={list.id}>
            <Link href={`/lists/${list.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-nav-hover">
              <Ring value={list.progress_percent} size={40} />
              <div className="min-w-0 flex-1">
                <strong className="block truncate text-sm font-semibold text-navy">{list.name || `List #${list.id}`}</strong>
                <span className="text-xs text-muted">{number(list.contact_count)} contacts · Created {date(list.created_at)}</span>
              </div>
              <StatusBadge value={list.status} />
            </Link>
          </li>)}
        </ul>}
      </Card>
    </div>
  </>;
}
