import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/theme";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home Market",
  description: "A marketplace for buying and renting houses, apartments, land and property",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <SessionProvider session={session}> */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="theme">
          <Header />
          {children}
        </ThemeProvider>

        <SpeedInsights />
        <Analytics />
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
