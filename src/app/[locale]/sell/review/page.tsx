import { Metadata } from "next";
import Review from "./Review";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";
import { getScopedI18n } from "@/locales/server";
import { types, features, listingType } from "@/lib/sellFlowData";

export const metadata: Metadata = {
  title: "Review",
};

const findMatching = (object: Array<{ id: string; translation: string }>, array: any, key: string) => {
  return object.filter((item) => {
    if (Array.isArray(array[key])) {
      return array[key].includes(item.id);
    }
    return array[key] === item.id;
  });
};

const findMatchingItem = (
  object: Array<{ id: string; translation: string }>,
  value: string | null | undefined
): { id: string; translation: string } | undefined => {
  return object.find((item) => item.id === value);
};

export default async function Page() {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    try {
      return <LockedLogin />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/api/auth/signin?callbackUrl=/sell");
    }
  }
  const url = getPath(headers());
  const unfinishedHome = await getUnfinishedHome(url);
  const { array, innerIndex, outerIndex } = await getStepData("/sell/review");
  const sellFlatIndex = await getSellFlowIndex("/sell/review");
  const r = await getScopedI18n("sell.review");
  const c = await getScopedI18n("sell.review.content");
  const f = await getScopedI18n("sell.features");
  const t = await getScopedI18n("sell.type");

  const title = r("title");
  const subtitle = r("subtitle");
  const bedrooms = c("bedrooms");
  const bathrooms = c("bathrooms");
  const livingRooms = c("living-rooms");
  const kitchens = c("kitchens");
  const listing = c("listing");
  const type_text = c("type");
  const capacity = c("capacity");
  const area = c("area");
  const m = c("units.m");
  const ft = c("units.ft");
  const features_text = c("features");
  const contactName = c("contactName");
  const contactEmail = c("contactEmail");
  const contactPhone = c("contactPhone");
  const price = c("price");
  const negotiable = c("negotiable");

  const featuresObject = Array.from({ length: 26 }, (_, index) => ({
    id: features[index],
    translation: f(`options.${index}` as keyof typeof t),
  }));

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: types[index],
    translation: t(`options.${index}` as keyof typeof t),
  }));

  const listingTypeObject = Array.from({ length: 3 }, (_, index) => ({
    id: listingType[index],
    translation: r(`listingType.${index}` as keyof typeof t),
  }));

  const matchingTypes = findMatching(typesObject, unfinishedHome, "type");
  const matchingFeatures = findMatching(featuresObject, unfinishedHome, "features");

  const matchingListingType = findMatchingItem(listingTypeObject, unfinishedHome?.listingType);

  return (
    <Review
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title_text={title}
      subtitle_text={subtitle}
      bedrooms_text={bedrooms}
      bathrooms_text={bathrooms}
      livingRooms_text={livingRooms}
      kitchens_text={kitchens}
      listing_text={listing}
      type_text={type_text}
      capacity_text={capacity}
      area_text={area}
      m_text={m}
      ft_text={ft}
      features_text={features_text}
      contactName_text={contactName}
      contactEmail_text={contactEmail}
      contactPhone_text={contactPhone}
      price_text={price}
      negotiable_text={negotiable}
      matchingFeatures={matchingFeatures}
      matchingTypes={matchingTypes}
      matchingListingType={matchingListingType}
    />
  );
}
