import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

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
        {children}
        <Header />
        {children}
        <SpeedInsights />
        <Analytics />
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
