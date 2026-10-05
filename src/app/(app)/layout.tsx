import { BottomNav, Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { getCreditBalance, getCurrentUser } from "@/lib/api";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const [user, balance] = await Promise.all([getCurrentUser(), getCreditBalance()]);
  return <div className="min-h-screen md:pl-[92px]">
    <a href="#main" className="sr-only z-50 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3">Skip to content</a>
    <Sidebar />
    <TopBar user={user} credits={balance.available} />
    <main id="main" className="mx-auto w-full max-w-[1600px] px-4 pb-28 pt-5 sm:px-6 sm:pt-6 md:pb-10 lg:px-8">{children}</main>
    <BottomNav />
  </div>;
}
