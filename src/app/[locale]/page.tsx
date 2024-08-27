import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Listings from "@/components/Listings";
import Locations from "@/components/Locations";
import { getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { getFeatured, getNew } from "./actions";

export default async function Home({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);
  const [scopedT, featuredHomesData, newHomesData] = await Promise.all([
    getScopedI18n("home"),
    getFeatured(),
    getNew(),
  ]);
  const newHomes = newHomesData.map((home) => home || null);
  const featuredHomes = featuredHomesData.map((home) => home || null);

  return (
    <div className="flex flex-col justify-between min-h-screen-minus-header-svh items-center">
      <main className="w-full">
        <Hero />
      </main>
      <div className="flex flex-col justify-start h-full w-full">
        <section className="flex flex-col justify-center items-center w-full h-full bg-zinc-100 dark:bg-zinc-950">
          <div className="flex flex-col pt-8 pb-4 justify-start w-full h-full max-w-7xl">
            <h2 className="flex justify-center items-start text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg font-normal">
              {scopedT("Recommended")}
            </h2>
            <Locations />
          </div>
        </section>
        <section className="flex flex-col justify-center items-center w-full h-full bg-background dark:bg-background">
          <div className="flex flex-col pt-8 pb-4 justify-start h-full w-full max-w-7xl">
            <h2 className="flex justify-center items-start text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg font-normal">
              {scopedT("Popular")}
            </h2>
            <Listings homes={featuredHomes} />
          </div>
        </section>
        <section className="flex flex-col justify-center items-center w-full h-full bg-zinc-100 dark:bg-zinc-950">
          <div className="flex flex-col pt-8 pb-4 justify-start h-full w-full max-w-7xl">
            <h2 className="flex justify-center items-start text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg font-normal">
              {scopedT("Newest")}
            </h2>
            <Listings homes={newHomes} />
          </div>
        </section>
      </div>

      <footer className="flex justify-center items-center p-6 w-full">
        <Footer />
      </footer>
    </div>
  );
}
