import Image from "next/image";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";

import DataTitle from "@/components/DataPageContent/Title";
import DataPageContent from "@/components/DataPageContent";
import getSession from "@/lib/getSession";

import { getLanguageAlternates } from "@/lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 30;

export async function generateMetadata(props: { params: Promise<{ locale: LanguageType }> }): Promise<Metadata> {
  const params = await props.params;
  const route = "/data";
  const languageAlternates = getLanguageAlternates(params.locale, route);
  return {
    title: "Data",
    description: "Analyze and discover about global properties on Viva Ideal.",
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

  const { locale } = params;

  setStaticParamsLocale(locale);
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }
  if (user.role !== "admin") {
    return (
      <main className="mx-auto my-10">
        <p className="text-center">You are not authorized to view this page</p>
      </main>
    );
  }

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
