import Listings from "@/components/Listings";
import Locations from "@/components/Locations";
import { getScopedI18n } from "@/locales/server";
import { locationImageIds } from "@/lib/validations";
import { typesMap } from "@/lib/sellFlowData";
import { urbanist } from "@/app/[locale]/fonts";
import Clients from "@/components/Clients";
import Logo from "@/components/ui/logo";
import Image from "next/image";
import LatestArticles from "@/components/LatestArticles";
import { ChevronRight } from "lucide-react";
import { LanguageType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePageContent(props: { locale: LanguageType }) {
  const locale = props.locale;
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
      <section className="flex  flex-col justify-center items-center w-full h-full">
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
      <section className="flex flex-col justify-center items-center w-full h-full">
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
      <section className="flex flex-col justify-center items-center w-full h-full">
        <div className="flex flex-col pb-4 md:pb-12 px-4 md:px-6 justify-start h-full w-full max-w-8xl">
          <div className="flex flex-col items-center gap-2 py-12 justify-center text-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {t("spotlight-sub")}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {/* <Newspaper strokeWidth={3} size={32} /> */}
              {t("spotlight")}
            </h2>
          </div>
          <Listings
            listingKey={"spotlight"}
            typesObject={typesObject}
            loginToViewPrice={loginToViewPrice}
            premiumText={premium("title")}
          />
        </div>
      </section>
      <section className="flex flex-col justify-center items-center w-full h-full">
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
      <section className="flex flex-col justify-center items-center w-full h-full">
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
      <section className="flex flex-col justify-center items-center w-full h-full">
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
      <section className="flex flex-col justify-center items-center w-full h-full">
        <div className="flex gap-6 pb-4 md:pb-12 px-4 md:px-6 justify-start h-full w-full max-w-8xl">
          <div className="flex flex-col items-center gap-2 py-12 justify-center text-center">
            <LatestArticles locale={locale} />
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center w-full h-full">
        <div className="flex flex-col w-full md:flex-row gap-12 pb-12 py-8 md:pb-20 px-8 md:px-6 justify-start h-full max-w-8xl">
          <div className="flex flex-col md:w-1/2 gap-10 md:gap-20">
            <div>
              <div className="flex gap-1 items-center">
                <div className="-ml-5">
                  <Logo width={"100"} height={"100"} />
                </div>
                <h4 className={`tracking-widest font-medium text-sm text-[#0C7A33] dark:test-primary`}>
                  {t("about.sub")}
                </h4>
              </div>
              <div className="flex flex-col gap-5">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#4F4F4F] dark:text-white">
                  {t("about.title")}
                </h3>
                <div className="text-sm md:text-md lg:text-lg font-medium text-[#505050] dark:text-white">
                  {t("about.body")}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full sm:flex-row justify-between">
              <Button
                asChild
                variant={"link"}
                className="flex gap-3 w-full md:w-fit justify-between sm:justify-center items-center font-semibold text-primary"
              >
                <Link href="/about">
                  <div className="text-sm md:text-md lg:text-lg ">{t("about.faq")}</div>
                  <ChevronRight className="bg-primary rounded-full text-white" />
                </Link>
              </Button>
              <Button
                asChild
                variant={"link"}
                className="flex gap-3 w-full md:w-fit justify-between sm:justify-center items-center font-semibold text-primary"
              >
                <Link href="/about">
                  <div className="text-sm md:text-md lg:text-lg ">{t("about.contact")}</div>
                  <ChevronRight className="bg-primary rounded-full text-white" />
                </Link>
              </Button>
              <Button
                asChild
                variant={"link"}
                className="flex gap-3 w-full md:w-fit justify-between sm:justify-center items-center font-semibold text-primary"
              >
                <Link href="/about">
                  <div className="text-sm md:text-md lg:text-lg ">{t("about.our-team")}</div>
                  <ChevronRight className="bg-primary rounded-full text-white" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden relative h-[400px] md:flex md:w-1/2 bg-white/70 dark:bg-[#021007]/70 shadow-xl rounded-3xl dark:shadow-white">
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/keys.webp`}
              alt="keys"
              fill={true}
              style={{ objectFit: "cover" }}
              loading={"eager"}
              quality={70}
              priority={true}
              placeholder="blur"
              blurDataURL={
                "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
              }
              sizes="(max-width: 400px) 400px,
                (max-width: 510px) 510px,
                (max-width: 768px) 768px, 
                (max-width: 1024px) 1024px, 
                (max-width: 1280px) 1280px, 
                (max-width: 1536px) 1536px,
                (max-width: 1920px) 1920px,
                100vw"
              className="rounded-3xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
