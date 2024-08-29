import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Listings from "@/components/Listings";
import Locations from "@/components/Locations";
import { getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { getFeatured, getNew } from "./actions";
import { locationImageIds } from "@/lib/validations";

export default async function Home({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);
  const [t, featuredHomesData, newHomesData] = await Promise.all([getScopedI18n("home"), getFeatured(), getNew()]);
  const newHomes = newHomesData.map((home) => home || null);
  const featuredHomes = featuredHomesData.map((home) => home || null);
  const countries = {
    AR: {
      folder: locationImageIds.AR.folder,
      city: { id: locationImageIds.AR.city, translation: t("AR.city") },
      neighborhoods: Array.from({ length: 3 }, (_, index) => ({
        id: locationImageIds.AR.neighborhoods[index],
        translation: t(`AR.neighborhoods.${index}` as keyof typeof t),
      })),
    },
    MX: {
      folder: locationImageIds.MX.folder,
      city: { id: locationImageIds.MX.city, translation: t("MX.city") },
      neighborhoods: Array.from({ length: 3 }, (_, index) => ({
        id: locationImageIds.MX.neighborhoods[index],
        translation: t(`MX.neighborhoods.${index}` as keyof typeof t),
      })),
    },
    BR: {
      folder: locationImageIds.BR.folder,
      city: { id: locationImageIds.BR.city, translation: t("BR.city") },
      neighborhoods: Array.from({ length: 3 }, (_, index) => ({
        id: locationImageIds.BR.neighborhoods[index],
        translation: t(`BR.neighborhoods.${index}` as keyof typeof t),
      })),
    },
    CO: {
      folder: locationImageIds.CO.folder,
      city: { id: locationImageIds.CO.city, translation: t("CO.city") },
      neighborhoods: Array.from({ length: 2 }, (_, index) => ({
        id: locationImageIds.CO.neighborhoods[index],
        translation: t(`CO.neighborhoods.${index}` as keyof typeof t),
      })),
    },
    CL: {
      folder: locationImageIds.CL.folder,
      city: { id: locationImageIds.CL.city, translation: t("CL.city") },
      neighborhoods: Array.from({ length: 3 }, (_, index) => ({
        id: locationImageIds.CL.neighborhoods[index],
        translation: t(`CL.neighborhoods.${index}` as keyof typeof t),
      })),
    },
    EC: {
      folder: locationImageIds.EC.folder,
      city: { id: locationImageIds.EC.city, translation: t("EC.city") },
      neighborhoods: Array.from({ length: 3 }, (_, index) => ({
        id: locationImageIds.EC.neighborhoods[index],
        translation: t(`EC.neighborhoods.${index}` as keyof typeof t),
      })),
    },
    PE: {
      folder: locationImageIds.PE.folder,
      city: { id: locationImageIds.PE.city, translation: t("PE.city") },
      neighborhoods: Array.from({ length: 3 }, (_, index) => ({
        id: locationImageIds.PE.neighborhoods[index],
        translation: t(`PE.neighborhoods.${index}` as keyof typeof t),
      })),
    },
    UY: {
      folder: locationImageIds.UY.folder,
      city: { id: locationImageIds.UY.city, translation: t("UY.city") },
      neighborhoods: Array.from({ length: 3 }, (_, index) => ({
        id: locationImageIds.UY.neighborhoods[index],
        translation: t(`UY.neighborhoods.${index}` as keyof typeof t),
      })),
    },
  };

  return (
    <div className="flex flex-col justify-between min-h-screen-minus-header-svh items-center">
      <main className="w-full">
        <Hero />
      </main>
      <div className="flex flex-col justify-start h-full w-full">
        <section className="flex flex-col justify-center items-center w-full h-full bg-zinc-100 dark:bg-zinc-900">
          <div className="flex flex-col pt-8 pb-4 justify-start w-full h-full max-w-7xl">
            <h2 className="flex justify-center items-start text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg font-normal">
              {t("Recommended")}
            </h2>
            <Locations countries={countries} />
          </div>
        </section>
        <section className="flex flex-col justify-center items-center w-full h-full bg-background dark:bg-background">
          <div className="flex flex-col pt-8 pb-4 justify-start h-full w-full max-w-7xl">
            <h2 className="flex justify-center items-start text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg font-normal">
              {t("Popular")}
            </h2>
            <Listings homes={featuredHomes} />
          </div>
        </section>
        <section className="flex flex-col justify-center items-center w-full h-full bg-zinc-100 dark:bg-zinc-900">
          <div className="flex flex-col pt-8 pb-4 justify-start h-full w-full max-w-7xl">
            <h2 className="flex justify-center items-start text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg font-normal">
              {t("Newest")}
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
