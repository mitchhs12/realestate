import Image from "next/image";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

import PricingTitle from "@/components/PricingPageContent/Title";
import PricingPageContent from "@/components/PricingPageContent";

import { languages } from "@/lib/validations";
import { Metadata } from "next";
import { getScopedI18n } from "@/locales/server";

export const revalidate = 30;

const languageAlternates = languages.reduce((acc: any, lang) => {
  acc[lang] = `/pricing/${lang}`;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare and contrast billing plans of different on Viva Ideal.",
  metadataBase: new URL("https://www.vivaideal.com/pricing"),
  alternates: {
    canonical: "/pricing",
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

export default async function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);
  const billing = await getScopedI18n("billing");

  const starterBilling = {
    title: billing("starter.title"),
    price: Number(billing("starter.price")),
    yearlyPrice: Number(billing("starter.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("starter.yearly-total-price")),
    perks: [
      {
        title: billing("starter.perks.0.title"),
        subtitle: billing("starter.perks.0.subtitle"),
      },
      {
        title: billing("starter.perks.1.title"),
        subtitle: billing("starter.perks.1.subtitle"),
      },
      {
        title: billing("starter.perks.2.title"),
        subtitle: billing("starter.perks.2.subtitle"),
      },
      {
        title: billing("starter.perks.3.title"),
        subtitle: billing("starter.perks.3.subtitle"),
      },
    ],
  };

  const proBilling = {
    title: billing("pro.title"),
    price: Number(billing("pro.price")),
    yearlyPrice: Number(billing("pro.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("pro.yearly-total-price")),
    blurb: billing("pro.blurb"),
    perks: [
      {
        title: billing("pro.perks.0.title"),
        subtitle: billing("pro.perks.0.subtitle"),
      },
      {
        title: billing("pro.perks.1.title"),
        subtitle: billing("pro.perks.1.subtitle"),
      },
      {
        title: billing("pro.perks.2.title"),
        subtitle: billing("pro.perks.2.subtitle"),
      },
      {
        title: billing("pro.perks.3.title"),
        subtitle: billing("pro.perks.3.subtitle"),
      },
    ],
  };

  const premiumBilling = {
    title: billing("premium.title"),
    price: Number(billing("premium.price")),
    yearlyPrice: Number(billing("premium.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("premium.yearly-total-price")),
    premium: billing("premium.blurb"),
    perks: [
      {
        title: billing("premium.perks.0.title"),
        subtitle: billing("premium.perks.0.subtitle"),
      },
      {
        title: billing("premium.perks.1.title"),
        subtitle: billing("premium.perks.1.subtitle"),
      },
      {
        title: billing("premium.perks.2.title"),
        subtitle: billing("premium.perks.2.subtitle"),
      },
      {
        title: billing("premium.perks.3.title"),
        subtitle: billing("premium.perks.3.subtitle"),
      },
      {
        title: billing("premium.perks.4.title"),
        subtitle: billing("premium.perks.4.subtitle"),
      },
      {
        title: billing("premium.perks.5.title"),
        subtitle: billing("premium.perks.5.subtitle"),
      },
    ],
  };

  const businessBilling = {
    title: billing("business.title"),
    price: Number(billing("business.price")),
    yearlyPrice: Number(billing("business.yearly-monthly-price")),
    totalYearlyPrice: Number(billing("business.yearly-total-price")),
    blurb: billing("business.blurb"),
    perks: [
      {
        title: billing("business.perks.0.title"),
        subtitle: billing("business.perks.0.subtitle"),
      },
      {
        title: billing("business.perks.1.title"),
        subtitle: billing("business.perks.1.subtitle"),
      },
      {
        title: billing("business.perks.2.title"),
        subtitle: billing("business.perks.2.subtitle"),
      },
      {
        title: billing("business.perks.3.title"),
        subtitle: billing("business.perks.3.subtitle"),
      },
      {
        title: billing("business.perks.4.title"),
        subtitle: billing("business.perks.4.subtitle"),
      },
    ],
  };

  const billingObject = {
    starter: starterBilling,
    pro: proBilling,
    premium: premiumBilling,
    business: businessBilling,
  };

  const billingText = {
    "most-popular": billing("most-popular"),
    subscribe: billing("subscribe"),
    "current-plan": billing("current-plan"),
    yearly: billing("yearly"),
    monthly: billing("monthly"),
    "billed-annually": billing("billed-annually"),
    "view-monthly-billing": billing("view-monthly-billing"),
    "save-with-yearly": billing("save-with-yearly"),
    "six-months-free": billing("six-months-free"),
  };

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="relative h-[20vh] flex w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/banner3.webp`}
          alt="background"
          fill={true}
          style={{ objectFit: "cover" }}
          quality={70}
          priority={true}
          sizes="(max-width: 400px) 400px,
        (max-width: 510px) 510px,
        (max-width: 768px) 768px, 
        (max-width: 1024px) 1024px, 
        (max-width: 1280px) 1280px, 
        (max-width: 1536px) 1536px,
        (max-width: 1920px) 1920px,
        100vw"
          className="-z-10 opacity-30 dark:opacity-20"
        />
        <PricingTitle locale={locale} />
      </div>

      <PricingPageContent locale={locale} billingObject={billingObject} billingText={billingText} />
    </div>
  );
}
