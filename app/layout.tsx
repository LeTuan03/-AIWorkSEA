import type { Metadata, Viewport } from "next";
import { Geist, Space_Mono } from "next/font/google";
import "./Retro.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toast";
import { NavigationProgress } from "@/components/NavigationProgress";
import { PageviewTracker } from "@/components/Analytics";
import { SITE_URL } from "@/lib/seo";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

// Retro display / typewriter face for headings, numbers and buttons.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIWORK SEA · Việc làm freelancer AI & Automation ở Đông Nam Á",
    template: "%s · AIWORK SEA",
  },
  description:
    "Job board chuyên tuyển freelancer AI, Machine Learning và Automation ở Đông Nam Á. Tìm dự án remote, contract và part-time.",
  keywords: [
    "freelancer AI",
    "automation jobs",
    "machine learning freelance",
    "Southeast Asia",
    "remote AI jobs",
  ],
  alternates: { canonical: "/" },
  verification: {
    google: "qugqN4Pfqv8re0526S67cOlEColV-NRq9aTdt0agAG8",
  },
  openGraph: {
    title: "AIWORK SEA",
    description:
      "Việc làm freelancer AI & Automation ở Đông Nam Á: remote, contract, part-time.",
    type: "website",
    url: SITE_URL,
    siteName: "AIWORK SEA",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWORK SEA",
    description:
      "Việc làm freelancer AI & Automation ở Đông Nam Á: remote, contract, part-time.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ece3cf" },
    { media: "(prefers-color-scheme: dark)", color: "#201d18" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${geist.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-[100dvh] flex-col">
        <ThemeProvider>
          <NavigationProgress />
          <PageviewTracker />
          <Toaster />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
