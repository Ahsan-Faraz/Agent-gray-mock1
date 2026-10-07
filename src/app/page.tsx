import clsx from "clsx";
import { ArrowRight, ArrowUpRight, Check, Mail, RefreshCw, Tags } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Faq } from "@/components/landing/Faq";
import { FeatureCarousel } from "@/components/landing/FeatureCarousel";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { logoFor, SOURCE_LOGOS } from "@/components/landing/BrandLogos";
import { SyncGraphic } from "@/components/landing/SyncGraphic";
import { TrustSection } from "@/components/landing/TrustSection";
import { Nav } from "@/components/landing/Nav";
import { SECTIONS } from "@/components/landing/sections";
import { OutcomeTabs } from "@/components/landing/OutcomeTabs";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { CountUp, Reveal } from "@/components/landing/Reveal";
import { Brand, buttonClass, LogoMark } from "@/components/ui";
import { getAuditEvents, getCalls, getContacts, getIntegrations, getLists, getTeamMembers } from "@/lib/api";
import { contactsForList } from "@/lib/mock-data";

export const metadata = { title: "Agent Gray · Know Who To Call Before You Call" };

const PACKS = [
  { credits: 100, note: "Try it on a single list." },
  { credits: 500, note: "For teams verifying lists every week.", featured: true },
  { credits: 1000, note: "For high-volume lead pipelines." },
];
const PACK_FEATURES = ["Processing one contact uses one credit", "Verified, wrong person and no engagement results", "Priority tiers P1 to P4", "Call evidence and audit history", "GoHighLevel, HubSpot and Attio sync", "CSV list reports"];

const FAQS = [
  { q: "What does Agent Gray do?", a: "Agent Gray verifies the contacts on your lists before your team calls them. Each processed contact comes back as verified, wrong person, no engagement or failed, with a confidence score and a priority tier." },
  { q: "Where do my contacts come from?", a: "Add contacts manually, import a CSV, or sync a connected CRM. GoHighLevel, HubSpot and Attio are supported from the Integrations page." },
  { q: "How do credits work?", a: "$1 = 1 credit, and processing one contact uses one credit. Credits are reserved when you confirm a list, and your available balance is checked again at confirmation." },
  { q: "When are calls made?", a: "Calls run between 09:00 and 20:00 in each receiver's timezone. Lists can start right away or be scheduled for a weekday; Sundays are closed." },
  { q: "Can I send results back to my CRM?", a: "Yes. Connected CRMs support result export, and GoHighLevel also supports outcome tags, so your pipeline reflects who is reachable." },
  { q: "Who in my team can do what?", a: "Workspaces have owner, admin, operator and viewer roles. Only owners and administrators can buy credits." },
];

function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.1em]", onDark ? "bg-white/12 text-white ring-1 ring-white/20" : "bg-brand-50 text-brand-ink ring-1 ring-brand-100")}>{children}</span>;
}

export default async function LandingPage() {
  const [lists, { total: callTotal }, { totals }, integrations, auditEvents, members] = await Promise.all([getLists(), getCalls(), getContacts(), getIntegrations(), getAuditEvents(), getTeamMembers()]);
  const sample = lists.find((list) => list.id === 105) ?? lists[0];
  const all = contactsForList(sample);
  // A mix of outcomes for the tabs panel.
  const seen: Record<string, number> = {};
  const rows = ["verified", "wrong_person", "verified", "no_engagement", "verified", "wrong_person", "no_engagement"]
    .map((outcome) => all.filter((row) => row.sureconnect_outcome === outcome)[(seen[outcome] = (seen[outcome] ?? -1) + 1)])
    .filter((row) => row !== undefined);
  const results = lists.reduce((sum, list) => ({ processed: sum.processed + list.processed_count, verified: sum.verified + list.verified_count }), { processed: 0, verified: 0 });
  const preview = (className?: string) => <ProductPreview lists={lists} contacts={totals.all} calls={callTotal} className={className} />;
  const people = contactsForList(lists.find((list) => list.id === 107) ?? lists[0]).map((row) => ({ name: row.contact_name, phone: row.phone_e164, outcome: "" }));
  const howList = lists.find((list) => list.id === 106) ?? lists[0];
  const howPeople = people.map((person, index) => ({ ...person, outcome: ["verified", "wrong_person", "verified", "no_engagement"][index % 4] }));

  return <div className="overflow-x-clip">
    <Nav />
    <main>
      <Hero preview={preview()} />

      {/* Contact sources marquee */}
      <section className="py-16 sm:py-20" aria-label="Contact sources">
        <p className="text-center text-sm font-medium text-muted">Bring contacts in from the tools you already use</p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="marquee flex w-max gap-14 pr-14">
            {[...SOURCE_LOGOS, ...SOURCE_LOGOS, ...SOURCE_LOGOS, ...SOURCE_LOGOS].map(({ name, Mark }, index) => <span key={index} className="flex items-center gap-3 text-2xl font-bold tracking-tight text-muted" aria-hidden={index >= SOURCE_LOGOS.length}>
              <Mark className="size-9" />{name}
            </span>)}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section id="product" className="px-2 sm:px-3">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-linear-to-br from-[#3a68f0] via-[#2448be] to-[#17253f] px-4 py-20 text-white sm:rounded-[36px] sm:px-6 sm:py-28">
          <span className="drift pointer-events-none absolute -right-32 -top-32 -z-10 size-[520px] rounded-full bg-[#7be0b6]/20 blur-[110px]" aria-hidden="true" />
          <span className="drift pointer-events-none absolute -bottom-40 -left-24 -z-10 size-[520px] rounded-full bg-[#9cb0ec]/25 blur-[110px] [animation-delay:-8s]" aria-hidden="true" />
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-3xl text-center">
              <Eyebrow onDark>List results</Eyebrow>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Know who picks up <span className="font-accent text-[#a9f0d0]">before</span> your team dials</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">Every contact in a list is processed and sorted by outcome, with a confidence score and a priority tier.</p>
            </Reveal>
            <Reveal className="mt-12" delay={100}><OutcomeTabs list={sample} rows={rows} /></Reveal>
            <div className="mt-20 grid gap-4 sm:grid-cols-3">
              {[
                { value: totals.all, label: "Contacts", note: "In the demo workspace" },
                { value: results.processed, label: "Processed", note: "Contacts across all lists" },
                { value: callTotal, label: "Call attempts", note: "Each with evidence" },
              ].map((stat, index) => <Reveal key={stat.label} delay={index * 90} className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/[0.08] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_40px_-24px_rgba(4,8,16,0.6)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/[0.12]">
                <span className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125" aria-hidden="true" />
                <p className="text-sm font-medium text-white/70">{stat.label}</p>
                <strong className="mt-3 block text-5xl font-semibold tracking-[-0.03em] text-white sm:text-[56px]"><CountUp value={stat.value} /></strong>
                <span className="mt-4 block h-px bg-linear-to-r from-white/30 to-transparent" aria-hidden="true" />
                <p className="mt-3 text-sm text-white/60">{stat.note}</p>
              </Reveal>)}
            </div>
          </div>
        </div>
      </section>

      {/* Feature carousel */}
      <section className="pb-20 pt-20 sm:pb-28 sm:pt-28" aria-labelledby="features-title">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <Eyebrow>Inside a list</Eyebrow>
          <h2 id="features-title" className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-navy sm:text-6xl">Everything a list needs, <span className="font-accent text-brand-ink">in one place</span></h2>
          <p className="mt-5 max-w-xl text-lg text-muted">Start from durable Contacts. Each list stores its own configuration and execution result.</p>
        </Reveal>
        <Reveal className="mt-4" delay={120}><FeatureCarousel /></Reveal>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-navy sm:text-6xl">From raw contacts to a <span className="font-accent text-brand-ink">call-ready</span> list</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">The same four-step workspace flow your team follows in the app.</p>
        </Reveal>
        <div className="mt-12 lg:mt-4">
          <HowItWorks contacts={totals.all} list={howList} people={howPeople} cta={<Link href="/signup" className={buttonClass("primary", "md", "h-12 rounded-full px-7")}>Create your workspace <ArrowRight size={17} aria-hidden="true" /></Link>} />
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="px-2 pb-20 sm:px-3 sm:pb-28">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-line bg-linear-to-b from-surface via-brand-50/60 to-surface px-4 py-20 sm:rounded-[36px] sm:px-6 sm:pb-16 sm:pt-28">
          <div className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(var(--line-strong)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden="true" />
          <span className="drift pointer-events-none absolute left-1/2 top-1/3 -z-10 size-[520px] -translate-x-1/2 rounded-full bg-brand-500/12 blur-[120px]" aria-hidden="true" />
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow>Integrations</Eyebrow>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-navy sm:text-6xl">Your CRM, <span className="font-accent text-brand-ink">kept in sync</span></h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">Connect a CRM to import contacts and send verification results back where your team works.</p>
          </Reveal>
          <Reveal className="mx-auto mt-14 max-w-6xl" delay={100}><SyncGraphic /></Reveal>
          <div className="mx-auto mt-16 grid max-w-6xl gap-5 lg:grid-cols-3">
            {integrations.map((item, index) => {
              const Mark = logoFor(item.provider);
              return <Reveal key={item.provider} delay={index * 90} className="group lift relative flex flex-col overflow-hidden rounded-3xl border border-line/70 bg-surface/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl">
                <span className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" style={{ background: item.color }} aria-hidden="true" />
                <div className="flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-2xl border border-line bg-surface-2 p-3 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3"><Mark className="size-full" /></span>
                  <h3 className="text-xl font-bold tracking-tight text-navy">{item.displayName}</h3>
                </div>
                <p className="mt-4 flex-1 leading-relaxed text-muted">{item.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.capabilityLabels.map((label) => <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-ink">
                    {label === "Contact sync" ? <RefreshCw size={12} aria-hidden="true" /> : label === "Outcome tags" ? <Tags size={12} aria-hidden="true" /> : <ArrowUpRight size={12} aria-hidden="true" />}{label}
                  </li>)}
                </ul>
              </Reveal>;
            })}
          </div>
        </div>
      </section>

      {/* Email CTA banner */}
      <section className="px-4 pb-20 sm:px-6 sm:pb-28">
        <Reveal className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-line bg-linear-to-br from-brand-50 via-surface to-brand-50 px-6 py-16 text-center sm:py-20">
          <span className="drift pointer-events-none absolute -left-20 top-0 -z-10 size-80 rounded-full bg-brand-500/20 blur-[90px]" aria-hidden="true" />
          <span className="drift pointer-events-none absolute -right-10 bottom-0 -z-10 size-80 rounded-full bg-[#7be0b6]/30 blur-[90px] [animation-delay:-7s]" aria-hidden="true" />
          <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-navy sm:text-6xl">Is your list calling the <span className="font-accent text-brand-ink">right people?</span></h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">Create a workspace, upload a CSV and see verified, wrong person and no engagement results side by side.</p>
          <form action="/signup" className="mx-auto mt-8 flex max-w-lg flex-col gap-2 rounded-2xl border border-line-strong bg-surface p-2 shadow-[var(--shadow-pop)] sm:flex-row sm:rounded-full">
            <label className="flex flex-1 items-center gap-2 px-3">
              <Mail size={17} className="text-subtle" aria-hidden="true" />
              <span className="sr-only">Work email</span>
              <input type="email" placeholder="Enter your work email" className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-subtle" />
            </label>
            <button type="submit" className={buttonClass("primary", "md", "h-11 rounded-full px-6")}>Get started</button>
          </form>
        </Reveal>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-2 sm:px-3">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-linear-to-b from-brand-50 to-canvas px-4 py-20 sm:rounded-[36px] sm:px-6 sm:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-navy sm:text-6xl">Pay only for <span className="font-accent text-brand-ink">contacts you process</span></h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted">$1 = 1 credit. Processing one contact uses one credit.</p>
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-6xl items-stretch gap-5 lg:grid-cols-3">
            {PACKS.map((pack, index) => <Reveal key={pack.credits} delay={index * 90} className={clsx("lift relative flex flex-col overflow-hidden rounded-3xl bg-surface/80 p-7 backdrop-blur-xl", pack.featured ? "border-2 border-brand-500 shadow-[0_30px_60px_-28px_rgba(49,94,234,0.55)] lg:-my-4 lg:py-11" : "border border-line/70 shadow-[var(--shadow-card)]")}>
              {pack.featured && <span className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-500/10 blur-2xl" aria-hidden="true" />}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-[0.1em] text-brand-ink">{pack.credits.toLocaleString("en-US")} credits</span>
                {pack.featured && <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">Most popular</span>}
              </div>
              <strong className="mt-5 block text-5xl font-semibold tracking-tight text-navy">${pack.credits.toLocaleString("en-US")}</strong>
              <span className="mt-1 text-sm text-muted">{pack.credits.toLocaleString("en-US")} contacts · {pack.note}</span>
              <ul className="mt-7 grid flex-1 gap-3 text-sm">
                {PACK_FEATURES.map((feature) => <li key={feature} className="flex gap-2.5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-good-soft text-good-ink"><Check size={12} strokeWidth={3} aria-hidden="true" /></span>{feature}
                </li>)}
              </ul>
              <Link href="/signup" className={buttonClass(pack.featured ? "primary" : "ghost", "md", "mt-8 h-12 w-full rounded-full text-[15px]")}>Buy {pack.credits.toLocaleString("en-US")} credits</Link>
            </Reveal>)}
          </div>
        </div>
      </section>

      {/* Trust */}
      <TrustSection events={auditEvents} members={members} />

      {/* FAQ */}
      <section id="faq" className="px-2 sm:px-3">
        <div className="rounded-[28px] bg-linear-to-b from-brand-50 to-canvas px-4 py-20 sm:rounded-[36px] sm:px-6 sm:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold tracking-[-0.035em] text-navy sm:text-6xl">Common questions about <span className="font-accent text-brand-ink">Agent Gray</span></h2>
          </Reveal>
          <Reveal className="mx-auto mt-12 max-w-3xl" delay={100}><Faq items={FAQS} /></Reveal>
          <Reveal className="mx-auto mt-6 max-w-3xl rounded-2xl border border-brand-100 bg-brand-50 px-6 py-5">
            <p className="font-bold text-navy">Have more questions?</p>
            <p className="mt-1 text-sm text-muted">Log in and open <Link href="/help" className="font-semibold text-brand-ink underline underline-offset-2">Help</Link> to see the full workspace flow.</p>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-2 pt-20 sm:px-3 sm:pt-28">
        <div className="relative isolate overflow-hidden rounded-t-[28px] bg-linear-to-br from-[#1d3c9e] via-[#17253f] to-[#0f1a30] text-white sm:rounded-t-[36px]">
          <span className="drift pointer-events-none absolute -right-32 -top-32 -z-10 size-[560px] rounded-full bg-[#315eea]/45 blur-[110px]" aria-hidden="true" />
          <span className="drift pointer-events-none absolute -bottom-40 left-10 -z-10 size-[420px] rounded-full bg-[#7be0b6]/15 blur-[110px] [animation-delay:-9s]" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <Reveal className="lg:pb-28">
              <h2 className="text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Know who to call.<br /><span className="font-accent text-[#a9f0d0]">Before you call.</span></h2>
              <p className="mt-6 max-w-md text-lg text-white/70">Manage contacts, verification lists, call evidence, and connected CRM synchronization from one workspace.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className={buttonClass("primary", "md", "h-12 rounded-full px-7 text-[15px]")}>Get started <ArrowRight size={17} aria-hidden="true" /></Link>
                <Link href="/login" className={buttonClass("ghost", "md", "h-12 rounded-full px-7 text-[15px]")}>Log in</Link>
              </div>
            </Reveal>
            <Reveal delay={150} className="-mb-16 lg:-mb-24 lg:translate-x-6">
              <div className="rounded-t-[30px] border border-b-0 border-white/15 bg-white/[0.06] p-2 pb-0 backdrop-blur-md sm:p-3 sm:pb-0">{preview("rounded-b-none")}</div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>

    <footer className="mx-2 mb-2 overflow-hidden rounded-b-[28px] bg-[#0b1220] text-white sm:mx-3 sm:mb-3 sm:rounded-b-[36px]">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-3 gap-x-4 gap-y-10 px-6 pb-10 pt-28 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-3 lg:col-span-1">
          <Brand size={40} onDark textClassName="text-xl" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">Know who to call before you call. Contact verification for teams that live on the phone.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/50">Product</p>
          <ul className="mt-4 grid gap-3 text-sm">{SECTIONS.map((item) => <li key={item.href}><a href={item.href} className="text-white/85 transition hover:text-white">{item.label}</a></li>)}</ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/50">Account</p>
          <ul className="mt-4 grid gap-3 text-sm">
            <li><Link href="/signup" className="text-white/85 transition hover:text-white">Create account</Link></li>
            <li><Link href="/login" className="text-white/85 transition hover:text-white">Log in</Link></li>
            <li><Link href="/dashboard" className="text-white/85 transition hover:text-white">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/50">Support</p>
          <ul className="mt-4 grid gap-3 text-sm">
            <li><Link href="/help" className="text-white/85 transition hover:text-white">Help</Link></li>
            <li><Link href="/integrations" className="text-white/85 transition hover:text-white">Integrations</Link></li>
            <li><Link href="/profile/billing" className="text-white/85 transition hover:text-white">Billing</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 border-t border-white/10 px-6 py-6 text-xs text-white/50">
        <span>© 2026 Agent Gray</span>
        <LogoMark size={22} onDark />
      </div>
      {/* Oversized wordmark */}
      <p className="pointer-events-none -mt-6 select-none whitespace-nowrap px-4 text-center text-[19vw] font-extrabold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(156,176,236,0.18)] bg-linear-to-b from-white/[0.07] to-transparent bg-clip-text" aria-hidden="true">Agent Gray</p>
    </footer>
  </div>;
}
