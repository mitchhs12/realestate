import Image from "next/image";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

import ArticlesTitle from "@/components/ArticlesPageContent/Title";
import ArticlesPageContent from "@/components/ArticlesPageContent";

export default function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="relative h-[20vh] flex w-full">
        <Image
          src="https://d3pkwgsrr79pi4.cloudfront.net/home/banners/banner4.webp"
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
