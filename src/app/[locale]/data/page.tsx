import Image from "next/image";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

import DataTitle from "@/components/DataPageContent/Title";
import DataPageContent from "@/components/DataPageContent";

import { languages } from "@/lib/validations";
import { Metadata } from "next";

export const revalidate = 30;

const languageAlternates = languages.reduce((acc: any, lang) => {
  acc[lang] = `/${lang}/data`;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Data",
  description: "Analyze and discover about global properties on Viva Ideal.",
  metadataBase: new URL("https://www.vivaideal.com/data"),
  alternates: {
    canonical: "/data",
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

export default function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

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
        <DataTitle locale={locale} />
      </div>

      <DataPageContent locale={locale} />
    </div>
  );
}
