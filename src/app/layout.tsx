import type { Metadata } from "next";
import { poppins } from "./fonts";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/theme";
import { QueryContextProvider } from "@/context/QueryContext";
import { CurrencyContextProvider } from "@/context/CurrencyContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Viva Ideal - Buy and sell global properties on the world's best real estate marketplace.",
  description: "A marketplace for buying and renting houses, apartments, land and property",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="theme">
            <CurrencyContextProvider>
              <QueryContextProvider>
                <Header />
                {children}
              </QueryContextProvider>
            </CurrencyContextProvider>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
