import Image from "next/image";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/utils";
import ArticlesPageContent from "@/components/ArticlesPage";
import { getScopedI18n } from "@/locales/server";
import { urbanist } from "@/app/[locale]/fonts";

export async function generateMetadata(props: { params: Promise<{ locale: LanguageType }> }): Promise<Metadata> {
  const params = await props.params;
  const route = "/articles";
  const languageAlternates = getLanguageAlternates(params.locale, route);
  return {
    title: "Articles",
    description: "Read and learn about global properties on Viva Ideal.",
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
export const revalidate = 30;

export default async function Page(props: { params: Promise<{ locale: LanguageType }> }) {
  const params = await props.params;

  const { locale } = params;

  setStaticParamsLocale(locale);
  const t = await getScopedI18n("articles");

  return (
    <div className="flex flex-col h-full items-center p-4 md:p-8 gap-16 py-6 w-full">
      <div className="flex flex-col items-center gap-2 pt-8 justify-center text-center">
        <h2
          className={`${urbanist.className} tracking-widest font-medium text-xl sm:text-2xl text-[#0C7A33] dark:text-primary`}
        >
          {t("main.sub")}
        </h2>
        <h1 className="flex items-center gap-4 sm:text-4xl text-5xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
          {t("main.title")}
        </h1>
      </div>

      <ArticlesPageContent locale={locale} />
    </div>
  );
}
