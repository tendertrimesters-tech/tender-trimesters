import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tender Trimesters — Your Pregnancy, One Week at a Time",
  description:
    "A nurturing weekly pregnancy calendar with daily affirmations, mood tracking, a private journal, and Tempie — your 24/7 AI companion. From the Mommies Matter family.",
  keywords: [
    "pregnancy app",
    "pregnancy calendar",
    "weekly pregnancy",
    "mood tracker",
    "pregnancy journal",
    "new mom",
    "Tender Trimesters",
    "Mommies Matter",
  ],
  authors: [{ name: "Helena-Ann Baker" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Tender Trimesters — Your Pregnancy, One Week at a Time",
    description:
      "A nurturing weekly pregnancy calendar with daily affirmations, mood tracking, a private journal, and Tempie — your 24/7 AI companion.",
    siteName: "Tender Trimesters",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tender Trimesters — Your Pregnancy, One Week at a Time" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tender Trimesters",
    description: "Your pregnancy, one week at a time.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://tendertrimesters.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${cormorant.variable} ${dancing.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
