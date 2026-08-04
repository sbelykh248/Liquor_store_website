import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { AgeGateProvider } from "@/lib/age-gate";
import { InventoryProvider } from "@/lib/inventory/provider";
import AgeGateOverlay from "@/components/AgeGateOverlay";
import SiteChrome from "@/components/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://juniorswineliquor.com"),
  title: {
    default: "Junior's Wine & Liquor · Bath Avenue, Brooklyn",
    template: "%s · Junior's Wine & Liquor",
  },
  description:
    "A family-run bottle shop on Bath Avenue, Brooklyn. Browse our shelf of wine, champagne, whiskey, tequila, vodka, cognac, rum, and liqueur.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-cream">
        <InventoryProvider>
          <AgeGateProvider>
            <div className="cellar-bg flex min-h-screen flex-col">
              <div className="relative z-10 flex min-h-screen flex-col">
                <SiteChrome>{children}</SiteChrome>
              </div>
            </div>
            <AgeGateOverlay />
          </AgeGateProvider>
        </InventoryProvider>
      </body>
    </html>
  );
}
