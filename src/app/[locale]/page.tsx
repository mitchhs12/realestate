import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";

import { getLanguageAlternates } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { locale: LanguageType } }): Promise<Metadata> {
  const languageAlternates = getLanguageAlternates(params.locale);

  return {
    title: "Home",
    description:
      "Search and explore global properties on Viva Ideal. Find your ideal home, apartment, or land in Latin America and beyond.",
    metadataBase: new URL("https://www.vivaideal.com"),
    alternates: {
      canonical: `https://www.vivaideal.com/${params.locale}`,
      languages: languageAlternates,
    },
  };
}

export default function Home({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  return (
    <div className="flex flex-col justify-between min-h-screen-minus-header-svh items-center">
      <main className="w-full">
        <Hero />
      </main>
      <HomePageContent />
      <footer className="flex justify-center items-center p-6 w-full bg-zinc-50 dark:bg-zinc-950">
        <Footer />
      </footer>
    </div>
  );
}
