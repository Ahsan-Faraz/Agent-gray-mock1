import type { Metadata } from "next";
import { Geist, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

// Display face for the landing page headlines.
const display = Geist({
  variable: "--font-display",
  subsets: ["latin"],
});

// Italic accent words on the landing page.
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  title: { default: "Agent Gray", template: "%s" },
  description: "Know who to call before you call.",
};

// Runs before first paint so dark mode never flashes light. The landing page
// (/) has its own fixed white-and-black design, so it is skipped there.
const themeScript = `try{if(location.pathname==="/")throw 0;var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${serif.variable} ${display.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
