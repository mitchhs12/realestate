import Listings from "@/components/Listings";
import Locations from "@/components/Locations";
import { getScopedI18n } from "@/locales/server";
import { locationImageIds } from "@/lib/validations";
import { typesMap } from "@/lib/sellFlowData";
import { urbanist } from "@/app/[locale]/fonts";
import Clients from "@/components/Clients";

export default async function HomePageContent() {
  const [t, type, p, premium] = await Promise.all([
    getScopedI18n("home"),
    getScopedI18n("sell.type"),
    getScopedI18n("search"),
    getScopedI18n("sell.checkout.premium"),
  ]);

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
    <div className="flex flex-col justify-start h-full w-full gap-2 sm:gap-3 bg-background">
      <section className="flex bg-gradient-to-b from-[#f4fbf6] to-[#f4f5fb] dark:from-[#021007] dark:to-[#020410] flex-col justify-center items-center w-full h-full">
        <div className="flex flex-col pb-4 md:pb-12 px-4 md:px-6 justify-start w-full h-full max-w-8xl">
          <div className="flex flex-col items-center gap-2 py-12 justify-center text-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {t("locations-sub")}
            </h3>
            <h2 className="flex items-center justify-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {/* <Map size={32} strokeWidth={3} /> */}
              {t("locations")}
            </h2>
          </div>
          <Locations countries={countries} />
        </div>
      </section>
      <section className="flex bg-white dark:bg-black flex-col justify-center items-center w-full h-full">
        <div className="flex flex-col pb-4 md:pb-12 px-4 md:px-6 justify-start w-full h-full max-w-8xl">
          <div className="flex flex-col items-center gap-2 py-12 justify-center text-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {t("trusted-sub")}
            </h3>
          </div>
          <Clients />
        </div>
      </section>
      <section className="flex flex-col bg-gradient-to-b from-[#f4f5fb] to-[#fbf4f8]  dark:from-[#020410] dark:to-[#10020b] justify-center items-center w-full h-full">
        <div className="flex flex-col pb-4 md:pb-12 px-4 md:px-6 justify-start h-full w-full max-w-8xl">
          <div className="flex flex-col items-center gap-2 py-12 justify-center text-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {t("newest-sub")}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {/* <Newspaper strokeWidth={3} size={32} /> */}
              {t("newest")}
            </h2>
          </div>
          <Listings
            listingKey={"newest"}
            typesObject={typesObject}
            loginToViewPrice={loginToViewPrice}
            premiumText={premium("title")}
          />
        </div>
      </section>
      <section className="flex flex-col bg-gradient-to-b from-[#fbf4f8] to-[#fbfaf4]  dark:from-[#10020b] dark:to-[#100e02] justify-center items-center w-full h-full">
        <div className="flex flex-col pb-4 md:pb-12 px-4 md:px-6 justify-start h-full w-full max-w-8xl">
          <div className="flex flex-col items-center gap-2 py-12 justify-center text-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {t("cheapest-sub")}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {/* <BadgeCent strokeWidth={3} size={32} /> */}
              {t("cheapest")}
            </h2>
          </div>
          <Listings
            listingKey={"cheapest"}
            typesObject={typesObject}
            loginToViewPrice={loginToViewPrice}
            premiumText={premium("title")}
          />
        </div>
      </section>
      <section className="flex flex-col bg-gradient-to-b from-[#fbfaf4] to-[#f4fbf6] dark:from-[#100e02] dark:to-[#021003] justify-center items-center w-full h-full">
        <div className="flex flex-col pb-4 md:pb-12 px-4 md:px-6 justify-start h-full w-full max-w-8xl">
          <div className="flex flex-col items-center gap-2 py-12 justify-center text-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {t("popular-sub")}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {/* <Heart strokeWidth={3} size={32} /> */}
              {t("popular")}
            </h2>
          </div>
          <Listings
            listingKey={"popular"}
            typesObject={typesObject}
            loginToViewPrice={loginToViewPrice}
            premiumText={premium("title")}
          />
        </div>
      </section>
    </div>
  );
}
