import Image from "next/image";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { Metadata } from "next";
import { languages } from "@/lib/validations";

import ArticlesTitle from "@/components/ArticlesPage/Title";
import ArticlesPageContent from "@/components/ArticlesPage";

const languageAlternates = languages.reduce((acc: any, lang) => {
  acc[lang] = `/${lang}/articles`;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Articles",
  description: "Read and learn about global properties on Viva Ideal.",
  metadataBase: new URL("https://www.vivaideal.com/articles"),
  alternates: {
    canonical: "/articles",
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

export const revalidate = 30;

export default function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="relative h-[20vh] flex w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/banner4.webp`}
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
        <ArticlesTitle locale={locale} />
      </div>

      <ArticlesPageContent locale={locale} />
    </div>
  );
}
