import type { Metadata } from "next";
import { poppins } from "./fonts";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/theme";
import { LocaleContextProvider } from "@/context/LocaleContext";
import { LanguageType } from "@/lib/validations";
import { locales } from "@/lib/validations";
import { headers } from "next/headers";
import Locale from "intl-locale-textinfo-polyfill";
import MainLayout from "@/components/MainLayout";
import { getStaticParams } from "@/locales/server";
import React from "react";

export const metadata: Metadata = {
  title: {
    default: "Viva Ideal | Buy and Sell Global Properties",
    template: "%s | Viva Ideal",
  },
  description:
    "Discover global properties for sale on Viva Ideal. Find your ideal home, apartment, or land in Latin America and beyond.",
};

export function generateStaticParams() {
  return getStaticParams();
}

type Props = {
  children: React.ReactNode;
  params: { locale: LanguageType };
};

export default async function RootLayout({ children, params }: Props) {
  const acceptLanguage = headers().get("Accept-Language");
  let matchedCurrency = "USD";
  if (acceptLanguage) {
    const language = acceptLanguage.split(",");
    const primaryLanguage = language[0];
    matchedCurrency = locales.find((option) => option.locale === primaryLanguage)?.currency || "USD";
  }
  const { direction: dir } = new Locale(params.locale).textInfo;

  return (
    <html lang={params.locale} dir={dir} suppressHydrationWarning>
      <body className={`${poppins.className} h-full`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            storageKey="theme"
            disableTransitionOnChange={true}
          >
            <LocaleContextProvider lang={params.locale} matchedCurrency={matchedCurrency}>
              <MainLayout>{children}</MainLayout>
            </LocaleContextProvider>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
