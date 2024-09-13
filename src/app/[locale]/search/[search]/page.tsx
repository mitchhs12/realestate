import CombinedSearchPage from "@/components/CombinedSearchPage";
import { CoordinatesType } from "@/lib/validations";
import { Metadata } from "next";
import { getScopedI18n } from "@/locales/server";
import { typesMap, featuresMap } from "@/lib/sellFlowData";
import { setStaticParamsLocale } from "next-international/server";
import { getSingleHome } from "../actions";

export const metadata: Metadata = {
  title: "Search for Properties",
  description:
    "Find your ideal home, apartment, or land on Viva Ideal. Search properties across Latin America and discover your dream property today.",
};

export default async function Page({ params }: { params: { locale: string; search: string } }) {
  setStaticParamsLocale(params.locale);
  const AWS_LOCATION_SERVICE_ENDPOINT = process.env.AWS_LOCATION_SERVICE_ENDPOINT;
  const INDEX_NAME = process.env.AWS_LOCATION_INDEX_NAME;
  const API_KEY = process.env.AWS_MAPS_API_KEY; // Replace with your API key
  const language = "en";
  let initZoom: number | null;
  let coordinates: CoordinatesType | null = null;
  let label = "";
  let category = "";

  if (params.search.startsWith("home-")) {
    const singleHome = await getSingleHome(Number(params.search.replace("home-", "")));
    if (singleHome) {
      coordinates = { lat: singleHome.latitude, long: singleHome.longitude };
      label = singleHome.title || "";
    }
  } else {
    const response = await fetch(
      `${AWS_LOCATION_SERVICE_ENDPOINT}/places/v0/indexes/${INDEX_NAME}/places/${params.search}?key=${API_KEY}&language=${language}`
    );
    // check the response
    if (!response.ok) {
      return (
        <div className="flex justify-center text-xl">
          Something went wrong fetching your location: {(response.status, response.statusText)}
        </div>
      );
    }
    const fullResponse = await response.json();
    const longLatArray = fullResponse.Place.Geometry.Point;
    label = fullResponse.Place.Label;
    coordinates = { lat: longLatArray[1], long: longLatArray[0] };
    category = fullResponse.Place.Categories[0];
  }

  switch (category) {
    case "AddressType":
      initZoom = 17; // Very close, focusing on a specific address
      break;
    case "StreetType":
      initZoom = 16; // Close, focusing on a street
      break;
    case "IntersectionType":
      initZoom = 17; // Very close, focusing on an intersection
      break;
    case "PointOfInterestType":
      initZoom = 15; // Close, default zoom level
      break;
    case "CountryType":
      initZoom = 5; // Zoomed out, showing the entire country
      break;
    case "RegionType":
      initZoom = 7; // A state or province, slightly zoomed out
      break;
    case "SubRegionType":
      initZoom = 10; // A county or metro area, more zoomed in
      break;
    case "MunicipalityType":
      initZoom = 11; // A city or town, zoomed in but not too close
      break;
    case "NeighborhoodType":
      initZoom = 14; // A neighborhood within a city, closer zoom
      break;
    case "PostalCodeType":
      initZoom = 15; // An area defined by postal code, fairly close
      break;
    default:
      initZoom = 16; // Default zoom level for undefined categories
      break;
  }

  const t = await getScopedI18n("search");
  const types = await getScopedI18n("sell.type");

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

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: types(`options.${index}` as keyof typeof types),
  }));

  // case for different categories set initZoom:

  if (coordinates && label && initZoom) {
    return (
      <main className="flex flex-col-reverse h-screen-minus-header-svh lg:flex-row justify-end ">
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
        />
      </main>
    );
  }
}
