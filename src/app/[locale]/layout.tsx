import type { Metadata } from "next";
import { poppins } from "@/app/[locale]/fonts";
import "@/app/[locale]/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/theme";
import { LocaleContextProvider } from "@/context/LocaleContext";
import { LanguageType } from "@/lib/validations";
import Locale from "intl-locale-textinfo-polyfill";
import MainLayout from "@/components/MainLayout";
import { getStaticParams } from "@/locales/server";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script"; // Import Script component

export const metadata: Metadata = {
  title: {
    default: "Viva Ideal | Buy and Sell Global Properties",
    template: "Viva Ideal | %s",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export function generateStaticParams() {
  return getStaticParams();
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: LanguageType }>;
};

export default async function RootLayout(props: Props) {
  const params = await props.params;

  const { children } = props;

  const { direction: dir } = new Locale(params.locale).textInfo;

  return (
    <html lang={params.locale} dir={dir} suppressHydrationWarning={true}>
      <head>
        {/* Google Analytics Script */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-QWTRWYKPDF" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QWTRWYKPDF');
          `}
        </Script>
      </head>
      <body className={`${poppins.className} h-full`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
            <LocaleContextProvider lang={params.locale}>
              <MainLayout>{children}</MainLayout>
              <Toaster />
            </LocaleContextProvider>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
