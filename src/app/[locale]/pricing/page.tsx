import Image from "next/image";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

import PricingPageContent from "@/components/PricingPageContent";

import { languages } from "@/lib/validations";
import { Metadata } from "next";
import { getScopedI18n } from "@/locales/server";

export const revalidate = 30;

// Function to generate language alternates excluding current locale
function getLanguageAlternates(currentLocale: LanguageType): Record<string, string> {
  return languages.reduce((acc: Record<string, string>, lang) => {
    if (lang !== currentLocale) {
      acc[lang] = `https://www.vivaideal.com/${lang}`;
    }
    return acc;
  }, {});
}

export async function generateMetadata({ params }: { params: { locale: LanguageType } }): Promise<Metadata> {
  const languageAlternates = getLanguageAlternates(params.locale);
  return {
    title: "Pricing",
    description: "Get started and compare subscription plans on Viva Ideal.",
    metadataBase: new URL("https://www.vivaideal.com"),
    alternates: {
      canonical: `https://www.vivaideal.com/${params.locale}/pricing`,
      languages: languageAlternates,
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
}

export default async function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);
  const billing = await getScopedI18n("billing");

  const freeBilling = {
    title: billing("free.title"),
    price: Number(billing("free.price")),
    yearlyPrice: Number(billing("free.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("free.yearly-total-price")),
    "monthly-perks": [
      {
        title: billing("free.perks-monthly.0.title"),
        subtitle: billing("free.perks-monthly.0.subtitle"),
      },
      {
        title: billing("free.perks-monthly.1.title"),
        subtitle: billing("free.perks-monthly.1.subtitle"),
      },
      {
        title: billing("free.perks-monthly.2.title"),
        subtitle: billing("free.perks-monthly.2.subtitle"),
      },
      {
        title: billing("free.perks-monthly.3.title"),
        subtitle: billing("free.perks-monthly.3.subtitle"),
      },
    ],
    "yearly-perks": [
      {
        title: billing("free.perks-yearly.0.title"),
        subtitle: billing("free.perks-yearly.0.subtitle"),
      },
      {
        title: billing("free.perks-yearly.1.title"),
        subtitle: billing("free.perks-yearly.1.subtitle"),
      },
      {
        title: billing("free.perks-yearly.2.title"),
        subtitle: billing("free.perks-yearly.2.subtitle"),
      },
      {
        title: billing("free.perks-yearly.3.title"),
        subtitle: billing("free.perks-yearly.3.subtitle"),
      },
    ],
  };

  const basicBilling = {
    title: billing("basic.title"),
    price: Number(billing("basic.price")),
    yearlyPrice: Number(billing("basic.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("basic.yearly-total-price")),
    blurb: billing("basic.blurb"),
    "monthly-perks": [
      {
        title: billing("basic.perks-monthly.0.title"),
        subtitle: billing("basic.perks-monthly.0.subtitle"),
      },
      {
        title: billing("basic.perks-monthly.1.title"),
        subtitle: billing("basic.perks-monthly.1.subtitle"),
      },
    ],
    "yearly-perks": [
      {
        title: billing("basic.perks-yearly.0.title"),
        subtitle: billing("basic.perks-yearly.0.subtitle"),
      },
      {
        title: billing("basic.perks-yearly.1.title"),
        subtitle: billing("basic.perks-yearly.1.subtitle"),
      },
    ],
  };

  const insightBilling = {
    title: billing("insight.title"),
    price: Number(billing("insight.price")),
    yearlyPrice: Number(billing("insight.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("insight.yearly-total-price")),
    blurb: billing("insight.blurb"),
    "monthly-perks": [
      {
        title: billing("insight.perks-monthly.0.title"),
        subtitle: billing("insight.perks-monthly.0.subtitle"),
      },
      {
        title: billing("insight.perks-monthly.1.title"),
        subtitle: billing("insight.perks-monthly.1.subtitle"),
      },
      {
        title: billing("insight.perks-monthly.2.title"),
        subtitle: billing("insight.perks-monthly.2.subtitle"),
      },
    ],
    "yearly-perks": [
      {
        title: billing("insight.perks-yearly.0.title"),
        subtitle: billing("insight.perks-yearly.0.subtitle"),
      },
      {
        title: billing("insight.perks-yearly.1.title"),
        subtitle: billing("insight.perks-yearly.1.subtitle"),
      },
      {
        title: billing("insight.perks-yearly.2.title"),
        subtitle: billing("insight.perks-yearly.2.subtitle"),
      },
    ],
  };

  const maxBilling = {
    title: billing("max.title"),
    price: Number(billing("max.price")),
    yearlyPrice: Number(billing("max.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("max.yearly-total-price")),
    blurb: billing("max.blurb"),
    "monthly-perks": [
      {
        title: billing("max.perks-monthly.0.title"),
        subtitle: billing("max.perks-monthly.0.subtitle"),
      },
      {
        title: billing("max.perks-monthly.1.title"),
        subtitle: billing("max.perks-monthly.1.subtitle"),
      },
      {
        title: billing("max.perks-monthly.2.title"),
        subtitle: billing("max.perks-monthly.2.subtitle"),
      },
    ],
    "yearly-perks": [
      {
        title: billing("max.perks-yearly.0.title"),
        subtitle: billing("max.perks-yearly.0.subtitle"),
      },
      {
        title: billing("max.perks-yearly.1.title"),
        subtitle: billing("max.perks-yearly.1.subtitle"),
      },
      {
        title: billing("max.perks-yearly.2.title"),
        subtitle: billing("max.perks-yearly.2.subtitle"),
      },
    ],
  };

  const starterBilling = {
    title: billing("starter.title"),
    price: Number(billing("starter.price")),
    yearlyPrice: Number(billing("starter.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("starter.yearly-total-price")),
    "monthly-perks": [
      {
        title: billing("starter.perks-monthly.0.title"),
        subtitle: billing("starter.perks-monthly.0.subtitle"),
      },
      {
        title: billing("starter.perks-monthly.1.title"),
        subtitle: billing("starter.perks-monthly.1.subtitle"),
      },
      {
        title: billing("starter.perks-monthly.2.title"),
        subtitle: billing("starter.perks-monthly.2.subtitle"),
      },
      {
        title: billing("starter.perks-monthly.3.title"),
        subtitle: billing("starter.perks-monthly.3.subtitle"),
      },
      {
        title: billing("starter.perks-monthly.4.title"),
        subtitle: billing("starter.perks-monthly.4.subtitle"),
      },
      {
        title: billing("starter.perks-monthly.5.title"),
        subtitle: billing("starter.perks-monthly.5.subtitle"),
      },
    ],
    "yearly-perks": [
      {
        title: billing("starter.perks-yearly.0.title"),
        subtitle: billing("starter.perks-yearly.0.subtitle"),
      },
      {
        title: billing("starter.perks-yearly.1.title"),
        subtitle: billing("starter.perks-yearly.1.subtitle"),
      },
      {
        title: billing("starter.perks-yearly.2.title"),
        subtitle: billing("starter.perks-yearly.2.subtitle"),
      },
      {
        title: billing("starter.perks-yearly.3.title"),
        subtitle: billing("starter.perks-yearly.3.subtitle"),
      },
      {
        title: billing("starter.perks-yearly.4.title"),
        subtitle: billing("starter.perks-yearly.4.subtitle"),
      },
      {
        title: billing("starter.perks-yearly.5.title"),
        subtitle: billing("starter.perks-yearly.5.subtitle"),
      },
    ],
  };

  const proBilling = {
    title: billing("pro.title"),
    price: Number(billing("pro.price")),
    yearlyPrice: Number(billing("pro.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("pro.yearly-total-price")),
    blurb: billing("pro.blurb"),
    "monthly-perks": [
      {
        title: billing("pro.perks-monthly.0.title"),
        subtitle: billing("pro.perks-monthly.0.subtitle"),
      },
      {
        title: billing("pro.perks-monthly.1.title"),
        subtitle: billing("pro.perks-monthly.1.subtitle"),
      },
      {
        title: billing("pro.perks-monthly.2.title"),
        subtitle: billing("pro.perks-monthly.2.subtitle"),
      },
      {
        title: billing("pro.perks-monthly.3.title"),
        subtitle: billing("pro.perks-monthly.3.subtitle"),
      },
    ],
    "yearly-perks": [
      {
        title: billing("pro.perks-yearly.0.title"),
        subtitle: billing("pro.perks-yearly.0.subtitle"),
      },
      {
        title: billing("pro.perks-yearly.1.title"),
        subtitle: billing("pro.perks-yearly.1.subtitle"),
      },
      {
        title: billing("pro.perks-yearly.2.title"),
        subtitle: billing("pro.perks-yearly.2.subtitle"),
      },
      {
        title: billing("pro.perks-yearly.3.title"),
        subtitle: billing("pro.perks-yearly.3.subtitle"),
      },
    ],
  };

  const premiumBilling = {
    title: billing("premium.title"),
    price: Number(billing("premium.price")),
    yearlyPrice: Number(billing("premium.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("premium.yearly-total-price")),
    blurb: billing("premium.blurb"),
    "monthly-perks": [
      {
        title: billing("premium.perks-monthly.0.title"),
        subtitle: billing("premium.perks-monthly.0.subtitle"),
      },
      {
        title: billing("premium.perks-monthly.1.title"),
        subtitle: billing("premium.perks-monthly.1.subtitle"),
      },
      {
        title: billing("premium.perks-monthly.2.title"),
        subtitle: billing("premium.perks-monthly.2.subtitle"),
      },
      {
        title: billing("premium.perks-monthly.3.title"),
        subtitle: billing("premium.perks-monthly.3.subtitle"),
      },
      {
        title: billing("premium.perks-monthly.4.title"),
        subtitle: billing("premium.perks-monthly.4.subtitle"),
      },
      {
        title: billing("premium.perks-monthly.5.title"),
        subtitle: billing("premium.perks-monthly.5.subtitle"),
      },
      {
        title: billing("premium.perks-monthly.6.title"),
        subtitle: billing("premium.perks-monthly.6.subtitle"),
      },
    ],
    "yearly-perks": [
      {
        title: billing("premium.perks-yearly.0.title"),
        subtitle: billing("premium.perks-yearly.0.subtitle"),
      },
      {
        title: billing("premium.perks-yearly.1.title"),
        subtitle: billing("premium.perks-yearly.1.subtitle"),
      },
      {
        title: billing("premium.perks-yearly.2.title"),
        subtitle: billing("premium.perks-yearly.2.subtitle"),
      },
      {
        title: billing("premium.perks-yearly.3.title"),
        subtitle: billing("premium.perks-yearly.3.subtitle"),
      },
      {
        title: billing("premium.perks-yearly.4.title"),
        subtitle: billing("premium.perks-yearly.4.subtitle"),
      },
      {
        title: billing("premium.perks-yearly.5.title"),
        subtitle: billing("premium.perks-yearly.5.subtitle"),
      },
      {
        title: billing("premium.perks-yearly.6.title"),
        subtitle: billing("premium.perks-yearly.6.subtitle"),
      },
    ],
  };

  const businessBilling = {
    title: billing("business.title"),
    price: Number(billing("business.price")),
    yearlyPrice: Number(billing("business.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("business.yearly-total-price")),
    blurb: billing("business.blurb"),
    "monthly-perks": [
      {
        title: billing("business.perks-monthly.0.title"),
        subtitle: billing("business.perks-monthly.0.subtitle"),
      },
      {
        title: billing("business.perks-monthly.1.title"),
        subtitle: billing("business.perks-monthly.1.subtitle"),
      },
      {
        title: billing("business.perks-monthly.2.title"),
        subtitle: billing("business.perks-monthly.2.subtitle"),
      },
      {
        title: billing("business.perks-monthly.3.title"),
        subtitle: billing("business.perks-monthly.3.subtitle"),
      },
      {
        title: billing("business.perks-monthly.4.title"),
        subtitle: billing("business.perks-monthly.4.subtitle"),
      },
      {
        title: billing("business.perks-monthly.5.title"),
        subtitle: billing("business.perks-monthly.5.subtitle"),
      },
    ],
    "yearly-perks": [
      {
        title: billing("business.perks-yearly.0.title"),
        subtitle: billing("business.perks-yearly.0.subtitle"),
      },
      {
        title: billing("business.perks-yearly.1.title"),
        subtitle: billing("business.perks-yearly.1.subtitle"),
      },
      {
        title: billing("business.perks-yearly.2.title"),
        subtitle: billing("business.perks-yearly.2.subtitle"),
      },
      {
        title: billing("business.perks-yearly.3.title"),
        subtitle: billing("business.perks-yearly.3.subtitle"),
      },
      {
        title: billing("business.perks-yearly.4.title"),
        subtitle: billing("business.perks-yearly.4.subtitle"),
      },
      {
        title: billing("business.perks-yearly.5.title"),
        subtitle: billing("business.perks-yearly.5.subtitle"),
      },
    ],
  };

  const sellerObject = {
    starter: starterBilling,
    pro: proBilling,
    premium: premiumBilling,
    business: businessBilling,
  };

  const buyerObject = {
    free: freeBilling,
    basic: basicBilling,
    insight: insightBilling,
    max: maxBilling,
  };

  const billingText = {
    "most-popular": billing("most-popular"),
    subscribe: billing("subscribe"),
    "current-plan": billing("current-plan"),
    "change-plan": billing("change-plan"),
    yearly: billing("yearly"),
    monthly: billing("monthly"),
    "billed-annually": billing("billed-annually"),
    "view-monthly-billing": billing("view-monthly-billing"),
    "save-with-yearly": billing("save-with-yearly"),
    "six-months-free": billing("six-months-free"),
    subText: { "six-months-free": billing("subText.six-months-free"), "per-month": billing("subText.per-month") },
    "lowest-prices": billing("lowest-prices"),
    title: billing("title"),
    buyersText: billing("buyers"),
    sellersText: billing("sellers"),
  };

  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/pricing`
      : `https://www.vivaideal.com/${locale}/pricing`;

  return (
    <div className="flex flex-col h-full w-full items-center">
      <PricingPageContent
        isCheckout={true}
        sellerObject={sellerObject}
        buyerObject={buyerObject}
        billingText={billingText}
        redirectUrl={redirectUrl}
      />
    </div>
  );
}
