import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { Metadata } from "next";
import { languages } from "@/lib/validations";
import Image from "next/image";
import { client } from "@/lib/sanity";
import AboutTitle from "@/components/AboutPage/Title";
import AboutPageContent from "@/components/AboutPage";

async function getData() {
  const query = `
  *[_type == "author"] {
    name,
    bio,
    "image_url": image.asset->url
  }
`;

  const data = await client.fetch(query);
  return data;
}

// Function to generate language alternates excluding current locale
function getLanguageAlternates(currentLocale: LanguageType): Record<string, string> {
  return languages.reduce((acc: Record<string, string>, lang) => {
    if (lang !== currentLocale) {
      acc[lang] = `https://www.vivaideal.com/${lang}/data`;
    }
    return acc;
  }, {});
}

export async function generateMetadata({ params }: { params: { locale: LanguageType } }): Promise<Metadata> {
  const languageAlternates = getLanguageAlternates(params.locale);
  return {
    title: "About Us",
    description: "Viva Ideal's team, mission, and contact details.",
    metadataBase: new URL("https://www.vivaideal.com"),
    alternates: {
      canonical: `https://www.vivaideal.com/${params.locale}/about`,
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

export const revalidate = 30;

export default async function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);
  const data = await getData();

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="relative h-[20vh] flex w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/banner5.webp`}
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
        <AboutTitle locale={locale} />
      </div>

      <AboutPageContent locale={locale} data={data} />
    </div>
  );
}
