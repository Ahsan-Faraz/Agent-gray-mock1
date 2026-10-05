"use client";

import clsx from "clsx";
import { CheckCircle2, Link2, RefreshCw, Search, Unplug } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink, Card, EmptyState, StatusBadge, inputClass, td, th } from "@/components/ui";
import { dateTime, humanize, number } from "@/lib/format";
import type { CRMProvider, ExportJob, Integration } from "@/lib/types";

// Content follows the original IntegrationsPage. Connect/disconnect/import are mock-only.

const IMPORT_GROUPS = [
  { key: "phone", title: "Phone", description: "Choose the CRM property containing the phone number Agent Gray should dial.", requirement: "Required", fields: [["phone", "Phone"]] },
  { key: "name", title: "Name", description: "Map Full name, or First name / Last name. Agent Gray combines First and Last when Full name is unavailable.", requirement: "Map at least one.", fields: [["full_name", "Full name"], ["first_name", "First name"], ["last_name", "Last name"]] },
  { key: "location", title: "Location", description: "Map Location, or one or more of City, State / region, Country. Agent Gray uses this to resolve the receiver's timezone.", requirement: "Map at least one.", guidance: "More location detail improves timezone accuracy. Contacts whose timezone cannot be resolved will not be called until resolved.", fields: [["location", "Location"], ["city", "City"], ["state_region", "State / region"], ["country", "Country"]] },
] as const;

const RESULT_FIELDS = [["priority_tier", "Priority tier"], ["confidence", "Confidence score"], ["outcome_explanation", "Outcome explanation"]] as const;
const CRM_PROPERTIES = ["phone", "mobilephone", "firstname", "lastname", "full_name", "city", "state", "country", "address", "agent_gray_priority", "agent_gray_confidence", "agent_gray_outcome"];
const DEFAULT_MAPPING: Record<string, string> = { phone: "phone", first_name: "firstname", last_name: "lastname", city: "city", state_region: "state", country: "country", priority_tier: "agent_gray_priority", confidence: "agent_gray_confidence" };

type Tab = "overview" | "import" | "results";

function MappingSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="grid gap-1.5 text-[13px] font-semibold">{label}
    <select className={`${inputClass} h-10`} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Not mapped</option>
      {CRM_PROPERTIES.map((property) => <option key={property} value={property}>{property}</option>)}
    </select>
  </label>;
}

function ProviderDetail({ item, onConnect, onDisconnect }: { item: Integration; onConnect: () => void; onDisconnect: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [mapping, setMapping] = useState(DEFAULT_MAPPING);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const connected = item.status === "Connected";
  const set = (key: string) => (value: string) => setMapping((current) => ({ ...current, [key]: value }));

  return <Card className="mt-4 overflow-hidden">
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-5 sm:px-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">{item.displayName}</p>
        <h2 className="mt-1 text-lg font-bold text-navy">Connection details</h2>
        <p className="mt-0.5 text-[13px] text-muted">{item.description}</p>
      </div>
      <StatusBadge value={item.status} label={item.status} />
    </header>
    <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 sm:px-4" aria-label={`${item.displayName} settings`}>
      {(["overview", "import", "results"] as const).map((value) => <button key={value} onClick={() => setTab(value)} aria-current={tab === value ? "page" : undefined} className={clsx("-mb-px whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold", tab === value ? "border-brand-500 text-brand-ink" : "border-transparent text-muted hover:text-ink")}>
        {value === "overview" ? "Overview" : value === "import" ? "Import mapping" : "Result mapping"}
      </button>)}
    </nav>

    <div className="p-5 sm:p-6">
      {notice && <p className="mb-4 flex items-center gap-2 rounded-xl bg-good-soft px-4 py-3 text-sm text-good-ink" role="status"><CheckCircle2 size={16} aria-hidden="true" />{notice}</p>}

      {tab === "overview" && <>
        <dl className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {([["Account", item.account ?? "No account connected"], [item.provider === "attio" ? "Workspace ID" : "Location / workspace", item.workspace_id ?? "—"], ["Total linked contacts", number(item.total_contacts)], ["Last connected", item.last_connected_at ? dateTime(item.last_connected_at) : "—"], ["Last successful import", item.last_successful_sync_at ? dateTime(item.last_successful_sync_at) : "—"], ["Latest import state", item.sync_status ? humanize(item.sync_status) : "Not imported"]] as const).map(([label, value]) => <div key={label} className="rounded-xl border border-line px-4 py-3">
            <dt className="text-[13px] text-muted">{label}</dt><dd className="mt-0.5 truncate font-semibold text-navy">{value}</dd>
          </div>)}
        </dl>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">If a normalized phone already exists in Agent Gray, we keep one contact and link this CRM record to it. Importing never starts calls. Exporting results is a separate action.</p>
        {item.provider === "attio" && !connected && <p className="mt-2 text-[13px] leading-relaxed text-muted">You can choose whether to switch Attio workspaces before authorization. The connected workspace name and ID will appear here afterward.</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {!connected && <Button size="sm" onClick={onConnect}><Link2 size={14} aria-hidden="true" /> Connect</Button>}
          {connected && <Button size="sm" onClick={() => setNotice(`${item.displayName} import queued.`)}><RefreshCw size={14} aria-hidden="true" /> Import contacts</Button>}
          {connected && <Button size="sm" variant="outline" onClick={() => setNotice("Export started (mock).")}>Export processed results</Button>}
          {connected && <Button size="sm" variant="danger" onClick={onDisconnect}><Unplug size={14} aria-hidden="true" /> Disconnect</Button>}
        </div>
      </>}

      {tab !== "overview" && !connected && <p className="text-sm text-muted">Field mappings become available after the OAuth connection is active.</p>}

      {tab === "import" && connected && <>
        <p className="text-[13px] text-muted">These mappings control how CRM records populate Agent Gray contacts. Existing contacts are reused by normalized phone number.</p>
        <div className="mt-4 grid gap-3">
          {IMPORT_GROUPS.map((group) => <section key={group.key} className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><h3 className="font-bold text-navy">{group.title} <span className="font-normal text-muted">— Required</span></h3><p className="mt-0.5 text-[13px] text-muted">{group.description}</p></div>
              <span className="rounded-full bg-neutral-soft px-2.5 py-1 text-xs font-semibold text-neutral-ink">{group.requirement}</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {group.fields.map(([key, label]) => <MappingSelect key={key} label={label} value={mapping[key] ?? ""} onChange={set(key)} />)}
            </div>
            {"guidance" in group && <p className="mt-3 text-[13px] text-muted">{group.guidance}</p>}
          </section>)}
        </div>
        <div className="mt-4 flex justify-end"><Button size="sm" onClick={() => setNotice("Field mappings saved.")}>Save mappings</Button></div>
      </>}

      {tab === "results" && connected && <>
        <p className="text-[13px] text-muted">Choose which CRM properties should receive Agent Gray results. Leave a result unmapped if you do not want Agent Gray to write it.</p>
        <label className="relative mt-4 block sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className={`${inputClass} h-10 pl-9`} placeholder="Search CRM properties" aria-label="Search CRM properties" />
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RESULT_FIELDS.filter(([, label]) => label.toLowerCase().includes(query.trim().toLowerCase())).map(([key, label]) => <MappingSelect key={key} label={label} value={mapping[key] ?? ""} onChange={set(key)} />)}
        </div>
        <div className="mt-4 flex justify-end"><Button size="sm" onClick={() => setNotice("Field mappings saved.")}>Save mappings</Button></div>
      </>}
    </div>
  </Card>;
}

export function IntegrationCards({ initial, exports }: { initial: Integration[]; exports: ExportJob[] }) {
  const [items, setItems] = useState(initial);
  const [selected, setSelected] = useState<CRMProvider | null>(null);
  const connectedCount = items.filter((item) => item.status === "Connected").length;
  const setStatus = (provider: CRMProvider, connected: boolean) => setItems((current) => current.map((item) => item.provider === provider ? { ...item, status: connected ? "Connected" : "Not connected", account: connected ? "Connected account" : null, last_connected_at: connected ? new Date().toISOString() : item.last_connected_at } : item));
  const selectedItem = items.find((item) => item.provider === selected);

  return <>
    <Card className="flex flex-wrap items-center justify-between gap-4 p-5" aria-label="CRM workspace summary">
      <div>
        <strong className="block text-navy">{connectedCount} connected · {items.length} available</strong>
        <span className="text-[13px] text-muted">Manage connections and mappings here, then send selected Agent Gray results in one export workflow.</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {connectedCount > 0 ? <Button size="sm">Send results to CRM</Button> : <Button size="sm" disabled title="Connect or repair a CRM with contact write access before sending results.">Send results to CRM</Button>}
        <Button size="sm" variant="ghost"><RefreshCw size={14} aria-hidden="true" /> Refresh all</Button>
      </div>
    </Card>
    {connectedCount === 0 && <p className="mt-2 text-[13px] text-muted">Connect or repair a CRM with contact write access before sending results.</p>}

    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const connected = item.status === "Connected";
        const isSelected = selected === item.provider;
        return <Card key={item.provider} className={clsx("lift flex flex-col p-5 sm:p-6", isSelected && "ring-2 ring-brand-500")}>
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl text-[15px] font-extrabold text-white" style={{ background: item.color }} aria-hidden="true">{item.initials}</span>
            <StatusBadge value={item.status} label={item.status} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-navy">{item.displayName}</h3>
          <p className="mt-1 text-sm text-muted">{item.description}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">{item.capabilityLabels.map((label) => <li key={label} className="rounded-md border border-line px-2 py-0.5 text-xs text-muted">{label}</li>)}</ul>
          <p className="mt-4 truncate text-[13px] font-semibold">{item.account ?? "No account connected"}</p>
          <dl className="mt-3 grid flex-1 grid-cols-2 gap-2 content-start">
            <div className="rounded-lg bg-canvas px-3 py-2"><dt className="text-xs text-muted">Linked contacts</dt><dd className="font-bold tabular-nums">{item.total_contacts?.toLocaleString() ?? "—"}</dd></div>
            <div className="rounded-lg bg-canvas px-3 py-2"><dt className="text-xs text-muted">Last successful import</dt><dd className="truncate text-[13px] font-bold">{item.last_successful_sync_at ? dateTime(item.last_successful_sync_at) : "—"}</dd></div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {!connected && <Button size="sm" onClick={() => setStatus(item.provider, true)}><Link2 size={14} aria-hidden="true" /> Connect</Button>}
            <Button size="sm" variant={connected ? "outline" : "ghost"} onClick={() => setSelected(item.provider)}>{connected ? "Manage" : "View details"}</Button>
          </div>
        </Card>;
      })}
    </div>

    {selectedItem
      ? <ProviderDetail key={selectedItem.provider} item={selectedItem} onConnect={() => setStatus(selectedItem.provider, true)} onDisconnect={() => setStatus(selectedItem.provider, false)} />
      : <Card className="mt-4"><EmptyState title="Choose a CRM" description="Open a provider to review its connection, mappings, and latest import." /></Card>}

    <Card className="mt-4 overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">Export activity</p>
          <h2 className="mt-1 font-bold text-navy">Recent exports</h2>
          <p className="mt-0.5 text-[13px] text-muted">Durable jobs remain available after you leave this page.</p>
        </div>
        <ButtonLink href="/integrations" size="sm" variant="ghost">View history</ButtonLink>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead><tr className="border-b border-line"><th className={th}>Destination</th><th className={th}>Contacts</th><th className={th}>Status</th><th className={th}>Created</th></tr></thead>
          <tbody>{exports.map((job) => <tr key={job.id} className="border-b border-line last:border-0">
            <td className={`${td} font-semibold text-navy`}>{job.destination}</td>
            <td className={`${td} tabular-nums`}>{number(job.contacts)}</td>
            <td className={td}><StatusBadge value={job.status} /></td>
            <td className={`${td} whitespace-nowrap text-muted`}>{dateTime(job.created_at)}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </Card>
  </>;
}
