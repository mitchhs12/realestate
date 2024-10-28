import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { Metadata } from "next";
import HomePageContent from "@/components/HomePageContent";
import { languages } from "@/lib/validations";

const languageAlternates = languages.reduce((acc: any, lang) => {
  acc[lang] = `/${lang}`;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Viva Ideal - Buy and Sell Global Properties",
  description:
    "Search and explore global properties on Viva Ideal. Find your ideal home, apartment, or land in Latin America and beyond.",
  metadataBase: new URL("https://www.vivaideal.com"),
  alternates: {
    canonical: "/",
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
