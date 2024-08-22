import type { Metadata } from "next";
import { poppins } from "./fonts";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/theme";
import { QueryContextProvider } from "@/context/QueryContext";
import { LocaleContextProvider } from "@/context/LocaleContext";
import { getCurrencies } from "@/app/[locale]/sell/actions";
import { LanguageType } from "@/lib/validations";
import { locales } from "@/lib/validations";
import { headers } from "next/headers";
import { getCurrency } from "@/lib/utils";
import Locale from "intl-locale-textinfo-polyfill";
import MainLayout from "@/components/MainLayout";
import { getStaticParams } from "@/locales/server"; // Adjust the path as needed

export const metadata: Metadata = {
  title: "Viva Ideal - Buy and sell global properties on the world's best real estate marketplace.",
  description: "A marketplace for buying and renting houses, apartments, land and property",
};

export function generateStaticParams() {
  return getStaticParams();
}

type Props = {
  children: React.ReactNode;
  params: { locale: LanguageType };
};

export default async function RootLayout({ children, params: { locale } }: Readonly<Props>) {
  const currencies = await getCurrencies();
  const acceptLanguage = headers().get("Accept-Language");
  let currency = { symbol: "USD", usdPrice: 1 };

  if (acceptLanguage) {
    const language = acceptLanguage.split(",");
    const primaryLanguage = language[0];
    const matchedCurrency = locales.find((option) => option.locale === primaryLanguage)?.currency || "USD";
    currency = getCurrency(currencies, matchedCurrency);
  }
  const { direction: dir } = new Locale(locale).textInfo;

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${poppins.className} h-full`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="theme">
            <LocaleContextProvider currencies={currencies} lang={locale} currency={currency}>
              <QueryContextProvider>
                <MainLayout>{children}</MainLayout>
              </QueryContextProvider>
            </LocaleContextProvider>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
