import clsx from "clsx";
import { ArrowUpRight, Check, Mail, RefreshCw, Tags } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoFor, SOURCE_LOGOS } from "@/components/landing/BrandLogos";
import { Faq } from "@/components/landing/Faq";
import { FeatureCarousel } from "@/components/landing/FeatureCarousel";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LpButton } from "@/components/landing/LpButton";
import { Nav } from "@/components/landing/Nav";
import { OutcomeTabs } from "@/components/landing/OutcomeTabs";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { CountUp, Reveal } from "@/components/landing/Reveal";
import { SECTIONS } from "@/components/landing/sections";
import { SyncGraphic } from "@/components/landing/SyncGraphic";
import { TrustSection } from "@/components/landing/TrustSection";
import { Brand } from "@/components/ui";
import { getAuditEvents, getCalls, getContacts, getIntegrations, getLists, getTeamMembers } from "@/lib/api";
import { contactsForList } from "@/lib/mock-data";

export const metadata = { title: "Agent Gray · Know Who To Call Before You Call" };

const PACKS = [
  { credits: 100, note: "Try it on a single list." },
  { credits: 500, note: "For teams verifying lists every week.", featured: true },
  { credits: 1000, note: "For high-volume lead pipelines." },
];
const PACK_FEATURES = ["Processing one contact uses one credit", "Verified, wrong person and no engagement results", "Priority tiers P1 to P4", "Call evidence and audit history", "GoHighLevel, HubSpot and Attio sync", "CSV list reports"];

const PILLARS = [
  { label: "Verify", title: "Every contact checked", body: "Each number comes back as verified, wrong person, no engagement or failed, with a confidence score." },
  { label: "Prioritize", title: "Call P1s first", body: "Contacts are ranked from P1 - Likely Answer to P4, so reps start with the people who pick up." },
  { label: "Sync", title: "Results in your CRM", body: "Outcomes flow back to GoHighLevel, HubSpot or Attio where your team already works." },
];

const FAQS = [
  { q: "What does Agent Gray do?", a: "Agent Gray verifies the contacts on your lists before your team calls them. Each processed contact comes back as verified, wrong person, no engagement or failed, with a confidence score and a priority tier." },
  { q: "Where do my contacts come from?", a: "Add contacts manually, import a CSV, or sync a connected CRM. GoHighLevel, HubSpot and Attio are supported from the Integrations page." },
  { q: "How do credits work?", a: "$1 = 1 credit, and processing one contact uses one credit. Credits are reserved when you confirm a list, and your available balance is checked again at confirmation." },
  { q: "When are calls made?", a: "Calls run between 09:00 and 20:00 in each receiver's timezone. Lists can start right away or be scheduled for a weekday; Sundays are closed." },
  { q: "Can I send results back to my CRM?", a: "Yes. Connected CRMs support result export, and GoHighLevel also supports outcome tags, so your pipeline reflects who is reachable." },
  { q: "Who in my team can do what?", a: "Workspaces have owner, admin, operator and viewer roles. Only owners and administrators can buy credits." },
];

function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return <span className={clsx("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium", onDark ? "border-white/15 text-white/70" : "border-black/10 text-black/60")}>
    <span className="size-1.5 rounded-full bg-brand-500" aria-hidden="true" />{children}
  </span>;
}

const h2 = "text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-6xl";

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

  return <div className="lp-light overflow-x-clip bg-white">
    <Nav />
    <main>
      <Hero preview={preview()} />

      {/* Contact sources */}
      <section className="py-16 sm:py-20" aria-label="Contact sources">
        <p className="text-center text-sm font-medium text-muted">Bring contacts in from the tools you already use</p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="marquee flex w-max gap-16 pr-16">
            {[...SOURCE_LOGOS, ...SOURCE_LOGOS, ...SOURCE_LOGOS, ...SOURCE_LOGOS].map(({ name, Mark }, index) => <span key={index} className="flex items-center gap-3 text-2xl font-medium tracking-tight text-black/45 grayscale transition hover:text-black hover:grayscale-0" aria-hidden={index >= SOURCE_LOGOS.length}>
              <Mark className="size-8" />{name}
            </span>)}
          </div>
        </div>
      </section>

      {/* The claim */}
      <section className="relative overflow-hidden border-t border-line px-4 py-24 sm:px-6 sm:py-32" aria-labelledby="claim-title">
        <span className="pointer-events-none absolute left-1/2 top-24 -z-0 h-[520px] w-[1100px] -translate-x-1/2 rounded-[50%] border border-black/[0.05]" aria-hidden="true" />
        <span className="pointer-events-none absolute left-1/2 top-40 -z-0 h-[520px] w-[820px] -translate-x-1/2 rounded-[50%] border border-black/[0.05]" aria-hidden="true" />
        <Reveal className="relative mx-auto max-w-5xl text-center">
          <Eyebrow>Connect rate</Eyebrow>
          <h2 id="claim-title" className={clsx(h2, "mt-6 text-black")}><span className="text-black/40">Increase your</span> connect rate</h2>
          <p className="mt-4 bg-linear-to-b from-black via-black/80 to-black/10 bg-clip-text text-[26vw] font-medium leading-[0.9] tracking-[-0.06em] text-transparent sm:text-[200px] lg:text-[240px]">20-30%</p>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">Your reps stop dialing wrong numbers and dead leads, and start every session with the contacts most likely to answer.</p>
        </Reveal>
        <div className="relative mx-auto mt-16 grid max-w-6xl border-t border-black/10 sm:grid-cols-3">
          {PILLARS.map((pillar, index) => <Reveal key={pillar.label} delay={index * 90} className="border-b border-black/10 py-8 sm:border-b-0 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0">
            <p className="text-sm font-medium text-brand-ink">{pillar.label}</p>
            <h3 className="mt-3 text-2xl font-medium tracking-tight text-black">{pillar.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{pillar.body}</p>
          </Reveal>)}
        </div>
      </section>

      {/* Outcomes (black) */}
      <section id="product" className="lp-dark dark relative isolate overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="lp-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,black,transparent)]" aria-hidden="true" />
        <span className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[1200px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(79,123,255,0.14),transparent)]" aria-hidden="true" />
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow onDark>List results</Eyebrow>
            <h2 className={clsx(h2, "mt-6 text-white")}><span className="text-white/45">Know who picks up</span> before your team dials</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">Every contact in a list is processed and sorted by outcome, with a confidence score and a priority tier.</p>
          </Reveal>
          <Reveal className="mt-14" delay={100}><OutcomeTabs list={sample} rows={rows} /></Reveal>
          <div className="mt-20 grid border-y border-white/10 sm:grid-cols-3">
            {[
              { value: totals.all, label: "Contacts", note: "In the demo workspace" },
              { value: results.processed, label: "Processed", note: "Contacts across all lists" },
              { value: callTotal, label: "Call attempts", note: "Each with evidence" },
            ].map((stat, index) => <Reveal key={stat.label} delay={index * 90} className="border-b border-white/10 py-10 last:border-b-0 sm:border-b-0 sm:border-l sm:px-8 sm:first:border-l-0">
              <p className="text-sm font-medium text-white/55">{stat.label}</p>
              <strong className="mt-4 block text-6xl font-medium tracking-[-0.04em] text-white"><CountUp value={stat.value} /></strong>
              <p className="mt-3 text-sm text-white/45">{stat.note}</p>
            </Reveal>)}
          </div>
        </div>
      </section>

      {/* Feature carousel */}
      <section className="py-24 sm:py-32" aria-labelledby="features-title">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <Eyebrow>Inside a list</Eyebrow>
          <h2 id="features-title" className={clsx(h2, "mt-6 max-w-3xl text-black")}><span className="text-black/40">Everything a list needs,</span> in one place</h2>
          <p className="mt-5 max-w-xl text-lg text-muted">Start from durable Contacts. Each list stores its own configuration and execution result.</p>
        </Reveal>
        <Reveal className="mt-4" delay={120}><FeatureCarousel /></Reveal>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl border-t border-line px-4 pb-24 pt-24 sm:px-6 sm:pb-32 sm:pt-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className={clsx(h2, "mt-6 text-black")}><span className="text-black/40">From raw contacts to a</span> call-ready list</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">The same four-step workspace flow your team follows in the app.</p>
        </Reveal>
        <div className="mt-12 lg:mt-4">
          <HowItWorks contacts={totals.all} list={howList} people={howPeople} cta={<LpButton href="/signup">Create your workspace</LpButton>} />
        </div>
      </section>

      {/* Integrations (black) */}
      <section id="integrations" className="lp-dark dark relative isolate overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="lp-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_45%,black,transparent)]" aria-hidden="true" />
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow onDark>Integrations</Eyebrow>
          <h2 className={clsx(h2, "mt-6 text-white")}><span className="text-white/45">Your CRM,</span> kept in sync</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">Connect a CRM to import contacts and send verification results back where your team works.</p>
        </Reveal>
        <Reveal className="mx-auto mt-16 max-w-6xl" delay={100}><SyncGraphic /></Reveal>
        <div className="mx-auto mt-16 grid max-w-6xl gap-4 lg:grid-cols-3">
          {integrations.map((item, index) => {
            const Mark = logoFor(item.provider);
            return <Reveal key={item.provider} delay={index * 90} className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.05]">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] p-2.5"><Mark className="size-full" /></span>
                <h3 className="text-xl font-medium tracking-tight text-white">{item.displayName}</h3>
                <ArrowUpRight size={18} className="ml-auto text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
              </div>
              <p className="mt-4 flex-1 leading-relaxed text-white/60">{item.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.capabilityLabels.map((label) => <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/75">
                  {label === "Contact sync" ? <RefreshCw size={12} aria-hidden="true" /> : label === "Outcome tags" ? <Tags size={12} aria-hidden="true" /> : <ArrowUpRight size={12} aria-hidden="true" />}{label}
                </li>)}
              </ul>
            </Reveal>;
          })}
        </div>
      </section>

      {/* Email CTA */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal className="mx-auto max-w-4xl text-center">
          <h2 className={clsx(h2, "text-black")}><span className="text-black/40">Is your list calling</span> the right people?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">Create a workspace, upload a CSV and see verified, wrong person and no engagement results side by side.</p>
          <form action="/signup" className="mx-auto mt-10 flex max-w-lg flex-col gap-2 rounded-3xl border border-black/10 bg-white p-1.5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)] sm:flex-row sm:rounded-full">
            <label className="flex flex-1 items-center gap-2 px-4">
              <Mail size={17} className="text-subtle" aria-hidden="true" />
              <span className="sr-only">Work email</span>
              <input type="email" placeholder="Enter your work email" className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-subtle" />
            </label>
            <button type="submit" className="h-11 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/85">Get started</button>
          </form>
        </Reveal>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-line px-4 py-24 sm:px-6 sm:py-32">
        <Reveal className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Pricing</Eyebrow>
            <h2 className={clsx(h2, "mt-6 max-w-2xl text-black")}><span className="text-black/40">Pay only for</span> contacts you process</h2>
          </div>
          <p className="max-w-sm text-lg text-muted">$1 = 1 credit. Processing one contact uses one credit.</p>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-6xl items-stretch gap-4 lg:grid-cols-3">
          {PACKS.map((pack, index) => <Reveal key={pack.credits} delay={index * 90} className={clsx("relative flex flex-col overflow-hidden rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-1", pack.featured ? "lp-dark dark lp-grid" : "bg-surface-2")}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">{pack.credits.toLocaleString("en-US")} credits</span>
              {pack.featured && <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
            </div>
            <strong className="mt-6 block text-6xl font-medium tracking-[-0.04em] text-navy">${pack.credits.toLocaleString("en-US")}</strong>
            <span className="mt-2 text-sm text-muted">{pack.credits.toLocaleString("en-US")} contacts · {pack.note}</span>
            <ul className="mt-8 grid flex-1 gap-3 border-t border-line pt-6 text-sm text-ink">
              {PACK_FEATURES.map((feature) => <li key={feature} className="flex gap-2.5"><Check size={16} className="mt-0.5 shrink-0 text-brand-ink" aria-hidden="true" />{feature}</li>)}
            </ul>
            <LpButton href="/signup" onDark={pack.featured} className="mt-8 w-full">Buy {pack.credits.toLocaleString("en-US")} credits</LpButton>
          </Reveal>)}
        </div>
      </section>

      {/* Trust (black) */}
      <div className="lp-dark dark relative isolate overflow-hidden">
        <div className="lp-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_30%,black,transparent)]" aria-hidden="true" />
        <TrustSection events={auditEvents} members={members} />
      </div>

      {/* FAQ */}
      <section id="faq" className="px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className={clsx(h2, "mt-6 text-black")}><span className="text-black/40">Common</span> questions</h2>
            <p className="mt-5 max-w-xs text-muted">Can&apos;t find what you&apos;re looking for? Log in and open <Link href="/help" className="font-semibold text-black underline underline-offset-4">Help</Link>.</p>
          </Reveal>
          <Reveal delay={100}><Faq items={FAQS} /></Reveal>
        </div>
      </section>

      {/* Final CTA (black, runs into the footer) */}
      <section className="lp-dark dark relative isolate overflow-hidden">
        <div className="lp-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_70%_at_75%_40%,black,transparent)]" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-40 top-0 -z-10 h-[700px] w-[900px] bg-[radial-gradient(closest-side,rgba(79,123,255,0.16),transparent)]" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-24 sm:px-8 sm:pt-32 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal className="lg:pb-28">
            <h2 className="text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-white sm:text-7xl">Know who to call.<br /><span className="text-white/45">Before you call.</span></h2>
            <p className="mt-6 max-w-md text-lg text-white/60">Increase your connect rate by <span className="text-white">20-30%</span>. Manage contacts, verification lists, call evidence, and connected CRM synchronization from one workspace.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LpButton href="/signup" onDark>Get started</LpButton>
              <LpButton href="/login" onDark variant="outline" arrow={false}>Log in</LpButton>
            </div>
          </Reveal>
          <Reveal delay={150} className="-mb-px">
            <div className="lp-light rounded-t-[30px] border border-b-0 border-white/15 bg-white/[0.06] p-2 pb-0 sm:p-3 sm:pb-0">{preview("rounded-b-none")}</div>
          </Reveal>
        </div>
      </section>
    </main>

    <footer className="lp-dark dark overflow-hidden border-t border-white/10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-x-4 gap-y-10 px-6 pb-10 pt-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-3 lg:col-span-1">
          <Brand size={40} onDark textClassName="text-xl" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">Know who to call before you call. Contact verification for teams that live on the phone.</p>
        </div>
        <div>
          <p className="text-sm font-medium text-white/40">Product</p>
          <ul className="mt-4 grid gap-3 text-sm">{SECTIONS.map((item) => <li key={item.href}><a href={item.href} className="text-white/80 transition hover:text-white">{item.label}</a></li>)}</ul>
        </div>
        <div>
          <p className="text-sm font-medium text-white/40">Account</p>
          <ul className="mt-4 grid gap-3 text-sm">
            <li><Link href="/signup" className="text-white/80 transition hover:text-white">Create account</Link></li>
            <li><Link href="/login" className="text-white/80 transition hover:text-white">Log in</Link></li>
            <li><Link href="/dashboard" className="text-white/80 transition hover:text-white">Dashboard</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-white/40">Support</p>
          <ul className="mt-4 grid gap-3 text-sm">
            <li><Link href="/help" className="text-white/80 transition hover:text-white">Help</Link></li>
            <li><Link href="/integrations" className="text-white/80 transition hover:text-white">Integrations</Link></li>
            <li><Link href="/profile/billing" className="text-white/80 transition hover:text-white">Billing</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-t border-white/10 px-6 py-6 text-xs text-white/45">
        <span>© 2026 Agent Gray</span>
        <span>Know who to call before you call.</span>
      </div>
      {/* Oversized wordmark */}
      <p className="pointer-events-none select-none whitespace-nowrap px-4 pb-4 text-center text-[19vw] font-semibold leading-[0.8] tracking-[-0.06em] text-transparent bg-linear-to-b from-white/[0.12] to-transparent bg-clip-text" aria-hidden="true">Agent Gray</p>
    </footer>
  </div>;
}
