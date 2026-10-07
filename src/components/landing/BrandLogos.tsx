import clsx from "clsx";
import { PenLine } from "lucide-react";

// Official logomarks: HubSpot from Simple Icons, Attio and HighLevel from the
// vendors' own websites. CSV and manual entry use neutral file/pen marks.

type MarkProps = { className?: string };

export function HubSpotMark({ className }: MarkProps) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path fill="#FF7A59" d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z" /></svg>;
}

export function AttioMark({ className }: MarkProps) {
  return <svg viewBox="0 0 31 25.6" className={clsx("text-[#0b0b0f] dark:text-white", className)} aria-hidden="true">
    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M30.6468 17.7823L28.0599 13.6422C28.0599 13.6422 28.0503 13.6248 28.0445 13.6172L27.8405 13.2919C27.4555 12.674 26.7895 12.3045 26.062 12.3025L21.8949 12.2891L21.6042 12.7549L16.6249 20.7234L16.3496 21.1642L18.4361 24.4978C18.821 25.1176 19.487 25.4872 20.2203 25.4872H26.06C26.7799 25.4872 27.4613 25.108 27.8424 24.4998L28.0483 24.1706C28.0483 24.1706 28.056 24.161 28.058 24.1572L30.6487 20.0112C31.0741 19.3337 31.0741 18.4579 30.6487 17.7823H30.6468ZM29.8576 19.5166L27.2669 23.6625C27.2553 23.6817 27.2419 23.6971 27.2303 23.7125C27.1398 23.8146 27.0224 23.828 26.9705 23.828C26.9108 23.828 26.7645 23.8107 26.6702 23.6606L24.0795 19.5146C24.0506 19.4684 24.0256 19.4203 24.0025 19.3683C23.9794 19.3183 23.9621 19.2683 23.9467 19.2163C23.8889 19.0084 23.8889 18.7851 23.9467 18.5773C23.9755 18.4753 24.0198 18.3732 24.0775 18.2809L26.6644 14.1388C26.6644 14.1388 26.6683 14.133 26.6702 14.1291C26.7318 14.0367 26.8088 13.9944 26.8762 13.9809C26.9031 13.9732 26.9262 13.9713 26.9454 13.9675C26.9551 13.9675 26.9647 13.9675 26.9743 13.9675C27.034 13.9675 27.1822 13.9867 27.2746 14.1368L29.8615 18.277C30.0982 18.6543 30.0982 19.1393 29.8615 19.5166H29.8576Z" />
    <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M22.9913 7.7644C23.4148 7.08496 23.4148 6.21112 22.9913 5.53553L20.4044 1.39536L20.1889 1.04697C19.802 0.429125 19.136 0.0595703 18.4046 0.0595703H12.5649C11.8354 0.0595703 11.1694 0.429125 10.7806 1.0489L0.323361 17.7847C0.113561 18.1196 0 18.5065 0 18.8992C0 19.2918 0.111636 19.6787 0.321436 20.0117L3.12582 24.5022C3.5127 25.1219 4.17866 25.4896 4.90815 25.4896H10.7479C11.4812 25.4896 12.1472 25.12 12.5321 24.5002L12.7458 24.1615C12.7458 24.1615 12.7458 24.1615 12.7458 24.1576C12.7458 24.1576 12.7496 24.1519 12.7496 24.1499L14.8342 20.8162L21.0127 10.9287L22.9875 7.76633L22.9913 7.7644ZM22.3812 6.64996C22.3812 6.86361 22.3215 7.07919 22.2002 7.26974L11.9566 23.6649C11.8643 23.8131 11.716 23.8304 11.6564 23.8304C11.5967 23.8304 11.4504 23.8131 11.3561 23.6649L8.7673 19.517C8.53248 19.1417 8.53248 18.6586 8.7673 18.2794L19.0109 1.8881C19.1033 1.73797 19.2515 1.72064 19.3112 1.72064C19.3708 1.72064 19.519 1.73797 19.6134 1.89002L22.2002 6.03019C22.3215 6.22074 22.3812 6.43632 22.3812 6.64996V6.64996Z" />
  </svg>;
}

export function HighLevelMark({ className }: MarkProps) {
  return <svg viewBox="0 0 37.46 30.08" className={className} aria-hidden="true">
    <path d="M29.6459 0L21.8371 7.70729H27.0573V30.0754H32.2345V12.0312L27.293 7.72427H32.2345V7.70729H37.4564L29.6459 0Z" fill="#17D94B" />
    <path d="M32.2345 7.72427H27.293L32.2345 12.0312V7.72427Z" fill="#0B6F26" />
    <path d="M15.6193 7.70729L7.8088 0L0 7.70729H5.2202V30.0482H10.3991V12.004L5.45756 7.69711H10.3991V7.70729H15.6193Z" fill="#FFD000" />
    <path d="M10.3991 7.69711H5.45756L10.3991 12.004V7.69711Z" fill="#855D19" />
    <path d="M26.543 18.4805L18.7342 10.7732L10.9237 18.4805H16.1456V30.0754H21.3228V22.7874L16.3813 18.4805H21.3228H26.543Z" fill="#2896FB" />
    <path d="M21.3228 18.4805H16.3813L21.3228 22.7874V18.4805Z" fill="#1C58A0" />
  </svg>;
}

// A spreadsheet file with a folded corner and a "CSV" label.
export function CsvMark({ className }: MarkProps) {
  return <svg viewBox="0 0 28 34" className={className} aria-hidden="true">
    <path d="M3 0h15l10 10v21a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3Z" fill="#1f9d63" />
    <path d="M18 0l10 10h-7a3 3 0 0 1-3-3V0Z" fill="#167a4c" />
    <rect x="4" y="16" width="20" height="11" rx="2" fill="#fff" fillOpacity="0.95" />
    <text x="14" y="24.6" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="800" fontSize="8" fill="#167a4c">CSV</text>
  </svg>;
}

export function ManualMark({ className }: MarkProps) {
  return <span className={clsx("grid place-items-center text-brand-ink", className)} aria-hidden="true"><PenLine className="size-[78%]" strokeWidth={2.2} /></span>;
}

export const SOURCE_LOGOS = [
  { key: "hubspot", name: "HubSpot", Mark: HubSpotMark },
  { key: "gohighlevel", name: "GoHighLevel", Mark: HighLevelMark },
  { key: "attio", name: "Attio", Mark: AttioMark },
  { key: "csv", name: "CSV import", Mark: CsvMark },
  { key: "manual", name: "Manual entry", Mark: ManualMark },
] as const;

export function logoFor(provider: string) {
  return SOURCE_LOGOS.find((logo) => logo.key === provider)?.Mark ?? CsvMark;
}
