import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ConsultProvider } from "@/components/consult/ConsultProvider";
import { Nav } from "@/components/sections/Nav";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const title =
  "Ashton Innovations | Decorative Drywall, Painting & Epoxy Floors | Fredericksburg, VA";
const description =
  "Decorative ceilings, flawless walls and now epoxy floors for higher-end homes in Fredericksburg, Stafford and Spotsylvania, Virginia. Drywall by design.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Ashton Innovations",
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Ashton Innovations",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ashton Innovations: a tray ceiling rendered above a metallic epoxy floor.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  // Concept site: keep it out of search results.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-plaster focus:px-4 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <ConsultProvider>
            <Nav />
            {children}
          </ConsultProvider>
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
