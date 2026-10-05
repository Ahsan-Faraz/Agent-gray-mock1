"use client";

import { ArrowLeft, Play, RefreshCw, Square } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button, ButtonLink, Card, Progress, StatusBadge, td, th } from "@/components/ui";
import { classificationResultLabel, confidencePercent, dateTime, humanize, number, priorityLabel, sourceLabel } from "@/lib/format";
import type { ContactList, ListContact } from "@/lib/types";

// Content follows the original BatchDetailPage (batch -> list). Actions are mock-only.
export function ListDetailClient({ list: initial, contacts, availableCredits }: { list: ContactList; contacts: ListContact[]; availableCredits: number }) {
  const [list, setList] = useState(initial);
  const [rerunOpen, setRerunOpen] = useState(false);
  const [refreshTrestle, setRefreshTrestle] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const remainingCredits = Math.max(0, list.contact_count - list.credits_consumed);
  const canStart = list.status === "created";
  const canCancel = ["scheduled", "scheduled_starting", "waiting_for_numbers", "running"].includes(list.status);
  const completed = contacts.filter((contact) => contact.processing_status === "completed").length;

  const cancel = () => {
    const liveWarning = list.run_mode === "live" ? " New calls will stop; calls already being dispatched or in progress will finish and keep accepting provider callbacks." : " Completed results will be kept.";
    if (window.confirm(`Cancel list #${list.id}? Cancelling will return ${number(remainingCredits)} unused credits to your available balance. ${number(list.credits_consumed)} credits already used for processed contacts will not be returned.${liveWarning}`)) setList({ ...list, status: "cancelled" });
  };
  const runAnalysis = () => {
    const refreshWarning = refreshTrestle ? " Trestle Caller Identification will be queried again first, followed by name matching." : " Existing Trestle names and details will be reused, followed by fresh LLM name matching.";
    if (!window.confirm(`This runs post-call analysis from stored call evidence and never starts a telephone call.${refreshWarning} Continue?`)) return;
    setAnalysisMessage(`${completed} queued, 0 cached/existing, ${contacts.length - completed} skipped, 0 failed, 0 ${priorityLabel("P3")}. No telephone call was started.`);
  };

  return <>
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.08em] text-brand-ink">List details</p>
        <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-[28px]">{list.name || `List #${list.id}`}</h1>
        <p className="mt-1 text-[15px] text-muted">{list.description || "Server-backed verification execution."}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ButtonLink href="/lists" variant="ghost"><ArrowLeft size={15} aria-hidden="true" /> Back</ButtonLink>
        <Button variant="ghost" onClick={() => setRerunOpen(true)}><RefreshCw size={15} aria-hidden="true" /> Rerun list</Button>
        {canStart && <Button onClick={() => setList({ ...list, status: "running" })}><Play size={15} aria-hidden="true" /> Start list</Button>}
        {canCancel && <Button variant="danger" onClick={cancel}><Square size={14} aria-hidden="true" /> {list.status === "scheduled" ? "Cancel list" : "Stop list"}</Button>}
      </div>
    </header>

    {list.scheduled_date && list.status === "scheduled" && <section className="mb-4 rounded-2xl border border-brand-200/60 bg-brand-50 px-5 py-4 text-sm">
      <strong className="text-brand-ink">Scheduled for {list.scheduled_date}</strong>
      <p className="mt-0.5 text-ink">The system starts this list on that date using the credits reserved at creation. Calls follow your workspace&apos;s receiver-local calling hours. Sundays and recognized US holidays remain closed.</p>
    </section>}

    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="p-5 sm:p-6 lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><StatusBadge value={list.status} /><p className="mt-2 text-[13px] text-muted">Created {dateTime(list.created_at)} · {sourceLabel(list.source_type)} · {list.run_mode} execution</p></div>
          <Button size="sm" variant="ghost"><RefreshCw size={14} aria-hidden="true" /> Refresh</Button>
        </div>
        <Progress value={list.progress_percent} className="mt-5 h-2.5" />
        <div className="mt-2 flex justify-between text-[13px] text-muted"><span><strong className="text-ink">{number(list.processed_count)}</strong> processed</span><span>{number(list.contact_count)} total</span></div>
        <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {([["Contacts", number(list.contact_count)], ["New / rerun", `${number(list.new_contact_count)} / ${number(list.rerun_contact_count)}`], ["Verified", number(list.verified_count)], ["Wrong person", number(list.wrong_person_count)], ["No engagement", number(list.no_engagement_count)], ["Failures", number(list.failure_count)], ["Credits consumed", number(list.credits_consumed)]] as const).map(([label, value]) => <div key={label} className="rounded-xl border border-line px-3.5 py-3">
            <dt className="text-[13px] text-muted">{label}</dt><dd className="mt-0.5 text-lg font-bold tabular-nums text-navy">{value}</dd>
          </div>)}
        </dl>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="font-bold text-navy">Execution status</h2>
        <dl className="mt-3 divide-y divide-line text-sm">
          {([["State", humanize(list.status)], ["Reanalysis", analysisMessage ? "running (1 queued/running)" : "not run"], ["Remaining", number(Math.max(0, list.contact_count - list.processed_count))], ["Last updated", dateTime(list.updated_at)]] as const).map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-2.5">
            <dt className="text-muted">{label}</dt><dd className="text-right font-semibold">{value}</dd>
          </div>)}
        </dl>
      </Card>

      <Card className="p-5 sm:p-6 lg:col-span-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-bold text-navy">Stored call analysis</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">Run LLM name matching and post-call analysis for every eligible contact with a stored call, including voicemail, machine, partial, and other call outcomes. Check the option only when Caller Identification should be queried again first. This never starts a telephone call.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]" role="status" aria-live="polite">
              <StatusBadge value={analysisMessage ? "running" : "not_run"} />
              <span className="text-muted">{analysisMessage ? `${completed} analysis jobs queued or running. This page refreshes automatically.` : "No stored analysis has been run for this list."}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-brand-600" checked={refreshTrestle} onChange={(event) => setRefreshTrestle(event.target.checked)} /> Re-run Trestle Caller Identification first</label>
            <Button size="sm" variant="outline" onClick={runAnalysis}>Run stored analysis</Button>
          </div>
        </div>
        {analysisMessage && <p className="mt-3 text-[13px] text-muted">{analysisMessage}</p>}
      </Card>
    </div>

    <Card className="mt-4 overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
        <div><h2 className="font-bold text-navy">Contacts in this execution</h2><p className="mt-0.5 text-[13px] text-muted">Results below are scoped to this list execution. A newer result from another list is intentionally not shown.</p></div>
        <span className="rounded-full border border-line px-3 py-1 text-[13px] font-semibold text-muted">{number(list.contact_count)} contacts</span>
      </div>
      <ul className="divide-y divide-line md:hidden">
        {contacts.map((contact) => <li key={contact.execution_id} className="px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><strong className="block truncate text-navy">{contact.contact_name || "Unknown contact"}</strong><span className="text-[13px] text-muted">{contact.phone_e164 || "Phone unavailable"}</span></div>
            <StatusBadge value={classificationResultLabel(contact.processing_status)} />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[13px]">
            <span><span className="text-muted">Result </span><strong>{humanize(classificationResultLabel(contact.sureconnect_outcome || "Pending"))}</strong></span>
            <span className="text-muted">Confidence <strong className="text-ink">{confidencePercent(contact.confidence)}</strong></span>
          </div>
          {contact.priority_tier && <div className="mt-2"><StatusBadge value={priorityLabel(contact.priority_tier, contact.review_state)} label={priorityLabel(contact.priority_tier, contact.review_state)} /></div>}
        </li>)}
      </ul>
      <div className="relative hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] text-sm">
          <thead><tr className="border-b border-line"><th className={th}>Contact</th><th className={th}>Execution status</th><th className={th}>Result for this list</th><th className={th}>Evidence confidence</th><th className={th}>Priority</th><th className={th}>Updated</th></tr></thead>
          <tbody>{contacts.map((contact) => <tr key={contact.execution_id} className="border-b border-line last:border-0">
            <td className={td}><strong className="block whitespace-nowrap font-semibold text-navy">{contact.contact_name || "Unknown contact"}</strong><small className="text-[13px] text-muted">{contact.phone_e164 || "Phone unavailable"}</small></td>
            <td className={td}><StatusBadge value={classificationResultLabel(contact.processing_status)} /></td>
            <td className={`${td} font-semibold`}>{humanize(classificationResultLabel(contact.sureconnect_outcome || "Pending"))}</td>
            <td className={`${td} tabular-nums`}>{confidencePercent(contact.confidence)}</td>
            <td className={td}><StatusBadge value={priorityLabel(contact.priority_tier, contact.review_state)} label={priorityLabel(contact.priority_tier, contact.review_state)} /></td>
            <td className={`${td} whitespace-nowrap text-muted`}>{dateTime(contact.updated_at)}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-[13px] text-muted sm:px-5">
        <span>1–{contacts.length} of {number(list.contact_count)}</span>
        <div className="flex gap-2"><Button size="sm" variant="ghost" disabled>Previous</Button><Button size="sm" variant="ghost" disabled={contacts.length >= list.contact_count}>Next</Button></div>
      </div>
    </Card>

    <Modal open={rerunOpen} onClose={() => setRerunOpen(false)} title="Review rerun credits" footer={<>
      <Button variant="ghost" size="sm" onClick={() => setRerunOpen(false)}>Cancel</Button>
      {list.contact_count > availableCredits
        ? <ButtonLink size="sm" href={`/profile/billing?credits=${list.contact_count - availableCredits}`}>Buy {number(list.contact_count - availableCredits)} credits</ButtonLink>
        : <ButtonLink size="sm" href="/lists/108">Create rerun list</ButtonLink>}
    </>}>
      <div className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line text-center">
        {([["Contacts", list.contact_count], ["Credits required", list.run_mode === "simulated" ? 0 : list.contact_count], ["Available credits", availableCredits]] as const).map(([label, value]) => <div key={label} className="px-2 py-4">
          <span className="block text-[13px] text-muted">{label}</span><strong className="mt-0.5 block text-xl tabular-nums text-navy">{number(value)}</strong>
        </div>)}
      </div>
      <p className="mt-3 text-[13px] text-muted">Credits are reserved when you confirm. Your available balance is checked again at confirmation.</p>
      {list.contact_count > availableCredits && <p className="mt-2 rounded-xl bg-bad-soft px-3.5 py-2.5 text-sm font-semibold text-bad-ink" role="alert">You need {number(list.contact_count - availableCredits)} more credits.</p>}
    </Modal>
  </>;
}
