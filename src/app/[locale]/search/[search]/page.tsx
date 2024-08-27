import CombinedSearchPage from "@/components/CombinedSearchPage";
import { CoordinatesType } from "@/lib/validations";
import { Metadata } from "next";
import { getScopedI18n } from "@/locales/server";

export const metadata: Metadata = {
  title: "Search",
};

export default async function Page({ params }: { params: { search: string } }) {
  const AWS_LOCATION_SERVICE_ENDPOINT = process.env.AWS_LOCATION_SERVICE_ENDPOINT;
  const INDEX_NAME = process.env.AWS_LOCATION_INDEX_NAME;
  const API_KEY = process.env.AWS_MAPS_API_KEY; // Replace with your API key
  const language = "en";

  const response = await fetch(
    `${AWS_LOCATION_SERVICE_ENDPOINT}/places/v0/indexes/${INDEX_NAME}/places/${params.search}?key=${API_KEY}&language=${language}`
  );

  const t = await getScopedI18n("search");
  const propertiesText = t("properties");
  const propertyText = t("property");
  const mapAreaText = t("map-area");
  const resultsText = t("results");
  const fullResponse = await response.json();
  const longLatArray = fullResponse.Place.Geometry.Point;
  const label = fullResponse.Place.Label;
  const coordinates: CoordinatesType = { lat: longLatArray[1], long: longLatArray[0] };
  const category = fullResponse.Place.Categories[0];
  let initZoom: number | null;
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

  // case for different categories set initZoom:

  if (response.status === 200) {
    return (
      <main className="flex flex-col-reverse h-screen-minus-header-svh lg:flex-row justify-end ">
        <CombinedSearchPage
          coordinates={coordinates}
          label={label}
          initZoom={initZoom}
          propertyText={propertyText}
          propertiesText={propertiesText}
          mapAreaText={mapAreaText}
          resultsText={resultsText}
        />
      </main>
    );
  } else {
    return (
      <div className="flex justify-center text-xl">
        Something went wrong fetching your location: {(response.status, response.statusText)}
      </div>
    );
  }
}
