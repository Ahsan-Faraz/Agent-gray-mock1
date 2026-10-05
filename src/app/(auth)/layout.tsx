import { Fingerprint, History, ServerCog } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { Brand } from "@/components/ui";

const proof = [
  { icon: ServerCog, title: "Durable", body: "Server-backed state" },
  { icon: History, title: "Traceable", body: "Evidence history" },
  { icon: Fingerprint, title: "Scoped", body: "Workspace access" },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
    <aside className="relative hidden overflow-hidden bg-auth text-white lg:flex lg:flex-col">
      <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-[#315eea]/35 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 size-[460px] rounded-full bg-[#315eea]/15 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-1 flex-col px-12 py-10 xl:px-16">
        <Link href="/login" className="self-start rounded-lg" aria-label="Agent Gray home"><Brand size={48} onDark textClassName="text-xl" /></Link>
        <div className="my-auto max-w-xl py-12">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#99ace0]">Contact verification workspace</p>
          <h1 className="mt-4 text-[42px] font-extrabold leading-[1.08] tracking-tight xl:text-[52px]">
            Know Who To Call <span className="text-[#9cb0ec]">Before You Call</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">Manage contacts, verification lists, call evidence, and connected CRM synchronization from one workspace.</p>
        </div>
        <ul className="grid grid-cols-3 gap-3">
          {proof.map(({ icon: Icon, title, body }) => <li key={title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
            <Icon size={20} className="text-[#9cb0ec]" aria-hidden="true" />
            <strong className="mt-3 block">{title}</strong>
            <span className="mt-0.5 block text-[13px] text-white/60">{body}</span>
          </li>)}
        </ul>
      </div>
    </aside>

    <main className="glow relative flex min-w-0 flex-col px-5 py-5 sm:px-8">
      <div className="flex items-center justify-between">
        <Link href="/login" className="rounded-lg lg:invisible" aria-label="Agent Gray home"><Brand size={38} /></Link>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-8">
        <div className="mb-7 text-center lg:hidden">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-ink">Contact verification workspace</p>
          <p className="mx-auto mt-2 max-w-sm text-[26px] font-extrabold leading-tight tracking-tight text-navy">Know Who To Call <span className="text-brand-ink">Before You Call</span></p>
        </div>
        {children}
      </div>
    </main>
  </div>;
}
