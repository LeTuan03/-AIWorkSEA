import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/Toast";
import { SITE_URL } from "@/lib/seo";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIWork SEA · Việc làm freelancer AI & Automation ở Đông Nam Á",
    template: "%s · AIWork SEA",
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
  openGraph: {
    title: "AIWork SEA",
    description:
      "Việc làm freelancer AI & Automation ở Đông Nam Á: remote, contract, part-time.",
    type: "website",
    url: SITE_URL,
    siteName: "AIWork SEA",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary",
    title: "AIWork SEA",
    description:
      "Việc làm freelancer AI & Automation ở Đông Nam Á: remote, contract, part-time.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef2ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={geist.variable} suppressHydrationWarning>
      <body className="flex min-h-[100dvh] flex-col">
        <ThemeProvider>
          <Toaster />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
