import CombinedSearchPage from "@/components/CombinedSearchPage";
import { CoordinatesType } from "@/lib/validations";
import { Metadata } from "next";
import { getScopedI18n } from "@/locales/server";
import { typesMap } from "@/lib/sellFlowData";
import { setStaticParamsLocale } from "next-international/server";
import { getLanguageAlternates } from "@/lib/utils";
import { LanguageType } from "@/lib/validations";

export async function generateMetadata(props: { params: Promise<{ locale: LanguageType }> }): Promise<Metadata> {
  const params = await props.params;
  const route = "/search";
  const languageAlternates = getLanguageAlternates(params.locale, route);
  return {
    title: "Search for Properties",
    description:
      "Find your ideal home, apartment, or land on Viva Ideal. Search properties across Latin America and discover your dream property today.",

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

export default async function Page(props: { params: Promise<{ locale: string; search: string }> }) {
  const params = await props.params;
  setStaticParamsLocale(params.locale);

  let initZoom: number = 4;
  let coordinates: CoordinatesType = { lat: -20.442, long: -61.3269 };
  let label = "";

  const t = await getScopedI18n("search");
  const types = await getScopedI18n("sell.type");
  const p = await getScopedI18n("sell.checkout.premium");

  const propertiesText = t("properties");
  const propertyText = t("property");
  const resultsText = t("results");
  const showMap = t("show-map");
  const showList = t("show-list");
  const loginToViewPrice = t("loginToViewPrices");
  const noHomesFound = t("no-homes-found");
  const propertiesMapText = t("propertiesText");
  const otherCategories = t("otherCategories");
  const loadingText = t("loading");
  const premiumText = p("title");

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: types(`options.${index}` as keyof typeof types),
  }));

  // case for different categories set initZoom:

  return (
    <CombinedSearchPage
      coordinates={coordinates}
      label={label}
      initZoom={initZoom}
      propertyText={propertyText}
      propertiesText={propertiesText}
      resultsText={resultsText}
      showMap={showMap}
      showList={showList}
      typesObject={typesObject}
      noHomesFound={noHomesFound}
      loginToViewPrice={loginToViewPrice}
      propertiesMapText={propertiesMapText}
      otherCategories={otherCategories}
      loadingText={loadingText}
      premiumText={premiumText}
    />
  );
}
