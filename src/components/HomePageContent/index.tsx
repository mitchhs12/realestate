import Listings from "@/components/Listings";
import Locations from "@/components/Locations";
import { getScopedI18n } from "@/locales/server";
import { getPopular, getNew, getCheapest } from "@/app/[locale]/actions";
import { locationImageIds } from "@/lib/validations";
import { Newspaper, HandCoins, Heart, Map, PiggyBank } from "lucide-react";
import { typesMap } from "@/lib/sellFlowData";

async function fetchWithCache(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 360 },
  });
  return res.json();
}

export default async function HomePageContent() {
  const [t, type, p] = await Promise.all([getScopedI18n("home"), getScopedI18n("sell.type"), getScopedI18n("search")]);
  const loginToViewPrice = p("loginToViewPrices");

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: type(`options.${index}` as keyof typeof t),
  }));

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
    <div className="flex flex-col justify-start h-full w-full gap-1 sm:gap-2 bg-background">
      <section className="flex bg-gradient-to-b from-[#f4fbf6] to-[#f4f5fb] dark:from-[#021007] dark:to-[#020410] flex-col justify-center items-center w-full h-full">
        <div className="flex flex-col pt-1 md:pt-4 md:pb-4 justify-start w-full h-full max-w-8xl">
          <h2 className="flex justify-center items-center gap-3 text-3xl font-normal py-4 tracking-wide">
            <Map size={28} strokeWidth={2} />
            {t("locations").toUpperCase()}
          </h2>
          <Locations countries={countries} />
        </div>
      </section>
      <section className="flex flex-col bg-gradient-to-b from-[#f4f5fb] to-[#fbf4f8]  dark:from-[#020410] dark:to-[#10020b] justify-center items-center w-full h-full">
        <div className="flex flex-col pt-1 md:pt-4 pb-1 md:pb-4 justify-start h-full w-full max-w-8xl">
          <h2 className="flex justify-center items-center gap-3 text-3xl font-normal py-4 tracking-wide">
            <Heart size={28} strokeWidth={2.4} />
            {t("popular").toUpperCase()}
          </h2>
          <Listings listingKey={"popular"} typesObject={typesObject} loginToViewPrice={loginToViewPrice} />
        </div>
      </section>
      <section className="flex flex-col bg-gradient-to-b from-[#fbf4f8] to-[#fbfaf4]  dark:from-[#10020b] dark:to-[#100e02] justify-center items-center w-full h-full">
        <div className="flex flex-col pt-1 md:pt-4 pb-1 md:pb-4 justify-start h-full w-full max-w-8xl">
          <h2 className="flex justify-center items-center gap-3 text-3xl font-normal py-4 tracking-wide">
            <PiggyBank size={34} strokeWidth={1.7} />
            {t("cheapest").toUpperCase()}
          </h2>
          <Listings listingKey={"cheap"} typesObject={typesObject} loginToViewPrice={loginToViewPrice} />
        </div>
      </section>
      <section className="flex flex-col bg-gradient-to-b from-[#fbfaf4] to-[#f4fbf6] dark:from-[#100e02] dark:to-[#021003] justify-center items-center w-full h-full">
        <div className="flex flex-col pt-1 md:pt-4 pb-1 md:pb-4 justify-start h-full w-full max-w-8xl">
          <h2 className="flex justify-center items-center gap-3 text-3xl font-normal py-4 tracking-wide">
            <Newspaper size={28} strokeWidth={2} />
            {t("newest").toUpperCase()}
          </h2>
          <Listings listingKey={"new"} typesObject={typesObject} loginToViewPrice={loginToViewPrice} />
        </div>
      </section>
    </div>
  );
}
