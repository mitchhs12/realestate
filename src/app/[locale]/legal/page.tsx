import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import Image from "next/image";
import LegalTitle from "./LegalTitle";
import LegalContent from "./LegalContent";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/utils";

export async function generateMetadata(props: { params: Promise<{ locale: LanguageType }> }): Promise<Metadata> {
  const params = await props.params;
  const route = "/legal";
  const languageAlternates = getLanguageAlternates(params.locale, route);
  return {
    title: "Legal",
    description: "Viva Ideal's legal information.",
    metadataBase: new URL("https://www.vivaideal.com"),
    alternates: {
      canonical: `https://www.vivaideal.com/${params.locale}${route}`,
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

export default async function Page(props: { params: Promise<{ locale: LanguageType }> }) {
  const params = await props.params;

  const {
    locale
  } = params;

  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col items-center w-full gap-8 h-screen-minus-header-svh">
      <div className="relative h-[20vh] flex w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/banner2.webp`}
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
        <LegalTitle locale={locale} />
      </div>
      <LegalContent />
    </div>
  );
}
