"use client";

import clsx from "clsx";
import { ArrowLeft, CheckCircle2, FileSpreadsheet, RefreshCw, Table2, Upload, Users, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type DragEvent, type FormEvent } from "react";
import { Button, ButtonLink, Card, PageHeader, buttonClass, inputClass, td, th } from "@/components/ui";
import { previewTimezones } from "@/lib/api";
import { date, number, sourceLabel } from "@/lib/format";
import type { ContactRow, TimezoneReviewContact } from "@/lib/types";

// Content follows the original "Create batch" page (batch -> list).
type SelectionMode = "new_only" | "selected" | "rerun_processed";

const MODES: Array<{ value: SelectionMode; icon: typeof Table2; title: string; body: string }> = [
  { value: "new_only", icon: Table2, title: "New only", body: "Contacts with no prior verification snapshot." },
  { value: "selected", icon: CheckCircle2, title: "Selected", body: "Choose exact durable Contacts below." },
  { value: "rerun_processed", icon: RefreshCw, title: "Rerun processed", body: "Re-execute contacts with prior results." },
];

const TIMEZONES = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Phoenix", "Pacific/Honolulu", "America/Anchorage"];

function tomorrow() {
  const value = new Date();
  value.setDate(value.getDate() + 1);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function isSunday(value: string) {
  return Boolean(value) && new Date(`${value}T00:00:00`).getDay() === 0;
}

function SchedulePolicy({ value }: { value: string }) {
  if (!value) return null;
  if (isSunday(value)) return <div className="rounded-xl border border-bad/30 bg-bad-soft px-4 py-3 text-sm text-bad-ink" role="alert">
    <strong className="block">This date can&apos;t be scheduled</strong>
    <ul className="ml-4 list-disc"><li>Sundays are closed.</li></ul>
    <span>Choose another weekday.</span>
  </div>;
  return <div className="rounded-xl border border-good/30 bg-good-soft px-4 py-3 text-sm text-good-ink" role="status">
    <strong className="block">Date available</strong>Weekday with no US federal or state holiday closure.
  </div>;
}

function TimezoneHint({ contact }: { contact: TimezoneReviewContact }) {
  return <small className="text-[13px] text-muted">{contact.timezone_message}{contact.timezone_candidates?.length ? ` Suggestions: ${contact.timezone_candidates.join(", ")}` : ""}</small>;
}

export function NewListForm({ availableCredits, contacts, totals }: { availableCredits: number; contacts: ContactRow[]; totals: { newContacts: number; processed: number } }) {
  const router = useRouter();
  const [origin, setOrigin] = useState<"contacts" | "csv">("csv");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [mode, setMode] = useState<SelectionMode>("new_only");
  const [selected, setSelected] = useState<number[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState<TimezoneReviewContact[] | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [applyAll, setApplyAll] = useState("");

  const visibleContacts = contacts.filter((contact) => !source || contact.source === source);
  const counts = useMemo(() => {
    if (origin === "csv") return { newContacts: csvFile ? 248 : 0, rerun: 0 };
    if (mode === "selected") {
      const chosen = contacts.filter((contact) => selected.includes(contact.id));
      return { newContacts: chosen.filter((contact) => contact.processing_state === "never_processed").length, rerun: chosen.filter((contact) => contact.processing_state !== "never_processed").length };
    }
    return mode === "new_only" ? { newContacts: totals.newContacts, rerun: 0 } : { newContacts: 0, rerun: totals.processed };
  }, [origin, csvFile, mode, selected, contacts, totals]);
  const total = counts.newContacts + counts.rerun;
  const scheduleBlocked = isSunday(scheduleDate);
  const listName = origin === "csv" && csvFile ? csvFile.name.replace(/\.csv$/i, "") || "CSV list" : name.trim() || "Verification list";
  const canSubmit = !saving && !scheduleBlocked && (origin === "csv" ? Boolean(csvFile) : mode !== "selected" || selected.length > 0);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    window.setTimeout(() => { setReview(previewTimezones(total)); setSaving(false); window.scrollTo({ top: 0 }); }, 500);
  };

  if (review) {
    const pending = review.filter((contact) => contact.timezone_status !== "resolved");
    const shortfall = Math.max(0, total - availableCredits);
    const saveTimezone = (ids: number[], timezone: string) => setReview((current) => current && current.map((contact) => ids.includes(contact.id) ? { ...contact, timezone, timezone_label: timezone, timezone_status: "resolved" } : contact));
    const remove = (id: number) => setReview((current) => current && current.filter((contact) => contact.id !== id));
    const timezoneInput = (contact: TimezoneReviewContact, className = "") => <input className={`${inputClass} h-10 ${className}`} list="iana-timezones" value={drafts[contact.id] ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [contact.id]: event.target.value }))} placeholder="America/New_York" aria-label={`Timezone for ${contact.name}`} />;
    const rowActions = (contact: TimezoneReviewContact) => <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={!drafts[contact.id]?.trim()} onClick={() => saveTimezone([contact.id], drafts[contact.id].trim())}>Save timezone</Button>
      <Button size="sm" variant="ghost" onClick={() => remove(contact.id)}>Remove from list</Button>
    </div>;

    return <>
      <PageHeader eyebrow="New execution" title="Review your list" description="Each contact accepted for processing reserves one credit." actions={<Button variant="ghost" onClick={() => setReview(null)}><ArrowLeft size={15} aria-hidden="true" /> Back to selection</Button>} />
      <Card className="p-5 sm:p-6">
        <div className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line text-center">
          {([["Contacts", total], ["Credits required", total], ["Available credits", availableCredits]] as const).map(([label, value]) => <div key={label} className="px-2 py-4">
            <span className="block text-[13px] text-muted">{label}</span>
            <strong className="mt-0.5 block text-xl tabular-nums text-navy sm:text-2xl">{number(value)}</strong>
          </div>)}
        </div>
        <p className="mt-3 text-[13px] text-muted">Credits are reserved when you confirm. Your available balance is checked again at confirmation.</p>
        <p className="text-[13px] text-muted">Calls run between 09:00 and 20:00 in each receiver&apos;s timezone.</p>
        {shortfall > 0 && <p className="mt-3 rounded-xl bg-bad-soft px-4 py-2.5 text-sm font-semibold text-bad-ink" role="alert">You need {number(shortfall)} more credits.</p>}
        {pending.length > 0 && <div className="mt-4 rounded-xl border border-warn/40 bg-warn-soft p-4">
          <strong className="text-warn-ink">Some timezones need your confirmation</strong>
          <p className="mt-1 text-sm text-ink">Choose a timezone for each row, apply one timezone to all, or remove a contact from this list. New contacts can also be removed from Contacts.</p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="grid flex-1 gap-1.5 text-[13px] font-semibold sm:max-w-xs">Apply one timezone to all<input className={`${inputClass} h-10`} list="iana-timezones" value={applyAll} onChange={(event) => setApplyAll(event.target.value)} placeholder="America/New_York" /></label>
            <Button size="sm" className="h-10" disabled={!applyAll.trim()} onClick={() => saveTimezone(pending.map((contact) => contact.id), applyAll.trim())}>Apply to all</Button>
          </div>
        </div>}
      </Card>

      <Card className="mt-4 overflow-hidden">
        <ul className="divide-y divide-line md:hidden">
          {review.map((contact) => {
            const needs = contact.timezone_status !== "resolved";
            return <li key={contact.id} className="grid gap-2 px-4 py-4">
              <div className="flex justify-between gap-3"><strong className="text-navy">{contact.name || "Unnamed contact"}</strong>{!needs && <span className="text-[13px] text-muted">Ready</span>}</div>
              <span className="text-[13px] text-muted">{contact.phone || "Not available"} · {contact.location || "No location provided"}</span>
              {needs ? <>{timezoneInput(contact)}<TimezoneHint contact={contact} />{rowActions(contact)}</> : <span className="text-[13px]"><strong>{contact.timezone}</strong> <span className="text-muted">{contact.timezone_label}</span></span>}
            </li>;
          })}
        </ul>
        <div className="relative hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line"><th className={th}>Contact</th><th className={th}>Phone</th><th className={th}>Location</th><th className={th}>Timezone</th><th className={th}>Action</th></tr></thead>
            <tbody>{review.map((contact) => {
              const needs = contact.timezone_status !== "resolved";
              return <tr key={contact.id} className="border-b border-line align-top last:border-0">
                <td className={td}><strong className="block whitespace-nowrap text-navy">{contact.name || "Unnamed contact"}</strong><small className="text-[13px] text-muted">{sourceLabel(contact.source)}{contact.is_new ? " · New" : ""}</small></td>
                <td className={`${td} whitespace-nowrap`}>{contact.phone || "Not available"}</td>
                <td className={td}>{contact.location || <span className="text-muted">No location provided</span>}</td>
                <td className={td}>{needs ? <div className="grid gap-1">{timezoneInput(contact, "min-w-48")}<TimezoneHint contact={contact} /></div> : <><strong className="block">{contact.timezone}</strong><small className="text-[13px] text-muted">{contact.timezone_label}</small></>}</td>
                <td className={td}>{needs ? rowActions(contact) : <span className="text-muted">Ready</span>}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
        <datalist id="iana-timezones">{TIMEZONES.map((zone) => <option key={zone} value={zone} />)}</datalist>
      </Card>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {shortfall > 0 ? <>
          <Button variant="ghost" onClick={() => setReview(null)}>Reduce contacts</Button>
          <ButtonLink href={`/profile/billing?credits=${shortfall}`}>Buy {number(shortfall)} credits</ButtonLink>
        </> : <>
          <Button variant="ghost" onClick={() => setReview(null)}>Back to selection</Button>
          <Button disabled={pending.length > 0 || saving || review.length === 0} onClick={() => { setSaving(true); window.setTimeout(() => router.push("/lists/108"), 500); }}>
            {saving ? "Saving…" : review.length === 0 ? "No eligible contacts" : scheduleDate ? "Schedule list" : "Create list"}
          </Button>
        </>}
      </div>
    </>;
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && /\.csv$/i.test(file.name)) setCsvFile(file);
  };

  return <>
    <PageHeader eyebrow="New execution" title="Create list" description="Start from durable Contacts. Each list stores its own configuration and execution result." actions={<ButtonLink href="/lists" variant="ghost"><ArrowLeft size={15} aria-hidden="true" /> Back to lists</ButtonLink>} />
    <form onSubmit={submit} className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-4">
        <Card className="overflow-hidden">
          {/* Where the contacts come from: one choice, then only its fields. */}
          <div className="grid grid-cols-2 border-b border-line" role="tablist" aria-label="Contacts">
            {([["csv", Upload, "Upload contacts CSV"], ["contacts", Users, "Durable Contacts"]] as const).map(([value, Icon, label]) => <button key={value} type="button" role="tab" aria-selected={origin === value} onClick={() => setOrigin(value)} className={clsx("flex items-center justify-center gap-2 border-b-2 px-3 py-3.5 text-sm font-semibold transition", origin === value ? "border-brand-500 bg-brand-50 text-brand-ink" : "border-transparent text-muted hover:bg-nav-hover hover:text-ink")}>
              <Icon size={17} aria-hidden="true" />{label}
            </button>)}
          </div>

          <div className="p-5 sm:p-6" role="tabpanel">
            {origin === "csv" ? <div className="grid gap-3">
              {csvFile ? <div className="flex items-center gap-3 rounded-xl border border-good/40 bg-good-soft px-4 py-3">
                <FileSpreadsheet size={22} className="shrink-0 text-good-ink" aria-hidden="true" />
                <div className="min-w-0 flex-1"><strong className="block truncate text-sm text-navy">{csvFile.name}</strong><span className="text-[13px] text-muted">{(csvFile.size / 1024).toFixed(1)} KB</span></div>
                <button type="button" onClick={() => setCsvFile(null)} className="grid size-8 place-items-center rounded-full border border-line-strong bg-surface text-muted hover:text-ink" aria-label="Remove file"><X size={15} /></button>
              </div> : <label htmlFor="list-csv" onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} className={clsx("flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-7 text-center transition sm:flex-row sm:text-left", dragging ? "border-brand-500 bg-brand-50" : "border-line-strong hover:border-brand-200 hover:bg-nav-hover")}>
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-ink"><Upload size={22} aria-hidden="true" /></span>
                <span className="flex-1"><strong className="block text-sm text-navy">Upload contacts CSV</strong><span className="text-[13px] text-muted">.csv file</span></span>
                <span className={buttonClass("outline", "sm")}>Browse</span>
              </label>}
              <input id="list-csv" type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)} />
              <p className="text-[13px] leading-relaxed text-muted">Headers may use phone, contact, or number. First/last name becomes the full name; city and state become location. US (+1) is used when the phone has no country code. Existing phone numbers are included in the new list.</p>
              {csvFile && <p className="rounded-xl bg-canvas px-4 py-3 text-[13px] text-ink">The CSV will be imported first, then a list will be created from all usable contacts in the import, including existing contacts. You will be redirected to that list when it is ready.</p>}
            </div> : <div className="grid gap-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <p className="max-w-lg text-[13px] text-muted">Selection is evaluated by the backend against durable Contacts. A contact may appear in multiple list executions.</p>
                <label className="grid gap-1.5 text-[13px] font-semibold">Source
                  <select className={`${inputClass} h-10 w-56`} value={source} onChange={(event) => { setSource(event.target.value); setSelected([]); }}>
                    <option value="">All durable Contacts</option><option value="gohighlevel">GoHighLevel contacts</option><option value="csv">CSV contacts</option><option value="manual">Manual contacts</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Contact selection">
                {MODES.map(({ value, icon: Icon, title, body }) => <label key={value} className={clsx("relative flex cursor-pointer gap-3 rounded-xl border p-3.5 transition", mode === value ? "border-brand-500 bg-brand-50" : "border-line-strong hover:bg-nav-hover")}>
                  <input type="radio" name="mode" className="sr-only" checked={mode === value} onChange={() => { setMode(value); setSelected([]); }} />
                  <Icon size={18} className={clsx("mt-0.5 shrink-0", mode === value ? "text-brand-ink" : "text-muted")} aria-hidden="true" />
                  <span><strong className="block text-sm text-navy">{title}</strong><span className="text-[13px] leading-snug text-muted">{body}</span></span>
                </label>)}
              </div>
              {mode === "selected" && <div className="grid max-h-72 gap-1 overflow-y-auto rounded-xl border border-line p-1.5">
                {visibleContacts.map((contact) => <label key={contact.id} className={clsx("flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5", selected.includes(contact.id) ? "bg-brand-50" : "hover:bg-nav-hover")}>
                  <input type="checkbox" className="size-4 accent-brand-600" checked={selected.includes(contact.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, contact.id] : current.filter((id) => id !== contact.id))} />
                  <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{contact.full_name || "Unnamed contact"}</strong><span className="text-[13px] text-muted">{contact.source || "Contact"} · {contact.location || contact.mobile_phone_e164 || "Phone unavailable"}</span></span>
                </label>)}
                {!visibleContacts.length && <div className="px-3 py-8 text-center"><strong className="block text-sm">No contacts available</strong><span className="text-[13px] text-muted">Sync or import contacts before selecting them.</span></div>}
              </div>}
            </div>}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid content-start gap-1.5 text-sm font-semibold">List name
              <input className={inputClass} value={origin === "csv" && csvFile ? listName : name} onChange={(event) => setName(event.target.value)} placeholder="Optional list name" disabled={origin === "csv" && Boolean(csvFile)} />
              <small className="text-[13px] font-normal text-muted">{origin === "csv" && csvFile ? "CSV list names are taken from the uploaded filename." : "Optional list name"}</small>
            </label>
            <label className="grid content-start gap-1.5 text-sm font-semibold">Schedule date (optional)
              <input type="date" className={inputClass} min={tomorrow()} value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} />
              <small className="text-[13px] font-normal text-muted">Pick a future weekday. Sundays, US federal holidays, and recognized state holidays are closed. Calls follow your workspace&apos;s receiver-local calling hours.</small>
            </label>
            {scheduleDate && <div className="grid gap-2 md:col-span-2">
              <SchedulePolicy value={scheduleDate} />
              {!scheduleBlocked && <small className="text-[13px] text-muted">1,640 of 2,000 daily call slots remain for {date(scheduleDate)}.</small>}
            </div>}
            <label className="grid gap-1.5 text-sm font-semibold md:col-span-2">Description
              <textarea className={`${inputClass} h-20 py-2.5`} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional operational context" />
            </label>
          </div>
        </Card>
      </div>

      <aside className="lg:sticky lg:top-24">
        <Card className="overflow-hidden">
          <div className="border-b border-line px-5 py-4"><h2 className="font-bold text-navy">Summary</h2></div>
          <dl className="grid gap-3 px-5 py-4 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted">New contacts</dt><dd className="font-bold tabular-nums">{number(counts.newContacts)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Previously processed / re-run</dt><dd className="font-bold tabular-nums">{number(counts.rerun)}</dd></div>
            {scheduleDate && !scheduleBlocked && <div className="flex justify-between gap-3"><dt className="text-muted">Schedule date</dt><dd className="font-bold">{date(scheduleDate)}</dd></div>}
          </dl>
          <div className="border-t border-line px-5 py-4">
            <p className="text-[13px] leading-relaxed text-muted">Live lists reserve one credit per eligible contact at creation. Simulated lists are free. <Link href="/profile/billing" className="font-semibold text-brand-ink underline">View balance and buy credits</Link></p>
            {scheduleDate && total > 0 && <p className="mt-2 text-[13px] text-muted">The server reserves exactly one workspace credit per eligible contact when the list is created.</p>}
            <Button type="submit" className="mt-4 h-11 w-full" disabled={!canSubmit}>{saving ? (origin === "csv" ? "Importing and creating…" : "Creating…") : origin === "csv" ? "Create list from CSV" : "Create list"}</Button>
          </div>
        </Card>
      </aside>
    </form>
  </>;
}
