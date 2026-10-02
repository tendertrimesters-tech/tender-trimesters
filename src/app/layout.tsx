import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const parisienne = localFont({ src: "../../fonts/parisienne-regular.ttf", variable: "--font-parisienne", display: "swap" });
const cormorant = localFont({ src: [{ path: "../../fonts/Cormorant-Regular.ttf", weight: "400" }, { path: "../../fonts/Cormorant-SemiBold.ttf", weight: "600" }, { path: "../../fonts/Cormorant-Bold.ttf", weight: "700" }], variable: "--font-cormorant", display: "swap" });
const jost = localFont({ src: "../../fonts/jost-regular.ttf", variable: "--font-jost", display: "swap" });

export const metadata: Metadata = {
  title: "Tender Trimesters — Your Pregnancy, One Week at a Time",
  description: "A nurturing weekly pregnancy calendar with daily tender notes, mood tracking, a private journal, and Tempie — your 24/7 AI companion. From the Mommies Matter family.",
  keywords: ["pregnancy app", "pregnancy calendar", "weekly pregnancy", "mood tracker", "pregnancy journal", "Tender Trimesters", "Mommies Matter"],
  authors: [{ name: "Helena-Ann Baker" }],
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
  openGraph: { title: "Tender Trimesters — Your Pregnancy, One Week at a Time", description: "A nurturing weekly pregnancy calendar with daily affirmations, mood tracking, a private journal, and Tempie — your 24/7 AI companion.", images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Tender Trimesters", description: "Your pregnancy, one week at a time.", images: ["/og-image.png"] },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://tendertrimesters.com"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${parisienne.variable} ${cormorant.variable} ${jost.variable}`}>
      <body className="antialiased bg-cream text-cocoa">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
