import { Metadata } from "next";
import Review from "./Review";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex, featuresMap, typesMap, listingType } from "@/lib/sellFlowData";
import { getUnfinishedHome } from "../../actions";
import { headers } from "next/headers";
import { getPath, findMatching, findMatchingItem } from "@/lib/utils";
import { getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Review",
};

export default async function Page(props: { params: Promise<{ locale: string; homeId: string }> }) {
  const params = await props.params;

  const { locale, homeId } = params;

  console.log("homeId in review", homeId);

  setStaticParamsLocale(locale);

  const session = await getSession();
  const user = session?.user;
  if (!user) {
    try {
      return <LockedLogin locale={locale} />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/api/auth/signin?callbackUrl=/sell");
    }
  }
  const unfinishedHome = await getUnfinishedHome(homeId);
  const { array, innerIndex, outerIndex } = await getStepData("review");
  const sellFlatIndex = await getSellFlowIndex("review");
  const r = await getScopedI18n("sell.review");
  const c = await getScopedI18n("sell.review.content");
  const cap = await getScopedI18n("sell.capacity");
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
  const ft = cap("units.ft");
  const m = cap("units.m");
  const changeToFeet = cap("change-to-feet");
  const changeToMetres = cap("change-to-metres");
  const features_text = c("features");
  const contactName = c("contactName");
  const contactEmail = c("contactEmail");
  const contactPhone = c("contactPhone");
  const price = c("price");
  const negotiable = c("negotiable");

  const featuresObject = Array.from({ length: 27 }, (_, index) => ({
    id: featuresMap[index].id,
    name: featuresMap[index].name,
    translation: f(`options.${index}` as keyof typeof f),
  }));

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: t(`options.${index}` as keyof typeof t),
  }));

  const listingTypeObject = Array.from({ length: 3 }, (_, index) => ({
    id: listingType[index],
    translation: r(`listingType.${index}` as keyof typeof r),
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
      change_to_metres={changeToFeet}
      change_to_feet={changeToMetres}
    />
  );
}
