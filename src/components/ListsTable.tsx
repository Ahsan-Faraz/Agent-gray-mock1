import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Progress, StatusBadge, td, th } from "@/components/ui";
import { dateTime, number, sourceLabel } from "@/lib/format";
import type { ContactList } from "@/lib/types";

// Original "Batches" table: Name, Source, Created, Status, Contacts, New / rerun, Progress.
export function ListsTable({ lists }: { lists: ContactList[] }) {
  return <>
    {/* Phones: one card per list. */}
    <ul className="divide-y divide-line md:hidden">
      {lists.map((list) => <li key={list.id}>
        <Link href={`/lists/${list.id}`} className="block px-4 py-4 active:bg-nav-hover">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <strong className="block truncate font-semibold text-navy">{list.name || `List #${list.id}`}</strong>
              <span className="text-[13px] text-muted">{sourceLabel(list.source_type)} · {dateTime(list.created_at)}</span>
            </div>
            <StatusBadge value={list.status} />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={list.progress_percent} className="flex-1" />
            <span className="text-[13px] font-semibold tabular-nums">{list.progress_percent}%</span>
          </div>
          <div className="mt-2 flex justify-between text-[13px] text-muted">
            <span>{number(list.contact_count)} contacts</span>
            <span>New / rerun <strong className="text-ink">{number(list.new_contact_count)}</strong> / {number(list.rerun_contact_count)}</span>
          </div>
        </Link>
      </li>)}
    </ul>

    <div className="relative hidden overflow-x-auto md:block">
      <table className="w-full min-w-[820px] text-sm">
        <thead><tr className="border-b border-line">
          <th className={th}>Name</th><th className={th}>Source</th><th className={th}>Created</th><th className={th}>Status</th><th className={th}>Contacts</th><th className={th}>New / rerun</th><th className={`${th} w-44`}>Progress</th><th className={th}><span className="sr-only">Open</span></th>
        </tr></thead>
        <tbody>
          {lists.map((list) => <tr key={list.id} className="border-b border-line last:border-0 hover:bg-nav-hover">
            <td className={td}>
              <Link href={`/lists/${list.id}`} className="block font-semibold text-navy hover:text-brand-ink">{list.name || `List #${list.id}`}</Link>
              <small className="text-[13px] text-muted">{list.description || `List #${list.id}`}</small>
            </td>
            <td className={`${td} whitespace-nowrap`}>{sourceLabel(list.source_type)}</td>
            <td className={`${td} whitespace-nowrap text-muted`}>{dateTime(list.created_at)}</td>
            <td className={td}><StatusBadge value={list.status} /></td>
            <td className={`${td} tabular-nums`}>{number(list.contact_count)}</td>
            <td className={`${td} tabular-nums`}><strong>{number(list.new_contact_count)}</strong> / {number(list.rerun_contact_count)}</td>
            <td className={td}><div className="flex items-center gap-2.5"><Progress value={list.progress_percent} className="flex-1" /><span className="w-9 text-right text-[13px] font-semibold tabular-nums">{list.progress_percent}%</span></div></td>
            <td className={`${td} text-right`}><Link href={`/lists/${list.id}`} aria-label={`Open ${list.name}`} className="inline-grid size-8 place-items-center rounded-full border border-line text-muted hover:bg-surface hover:text-brand-ink"><ChevronRight size={16} aria-hidden="true" /></Link></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </>;
}
