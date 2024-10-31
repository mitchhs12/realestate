import { Metadata } from "next";
import Rooms from "./Rooms";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Rooms",
};

export default async function Page({ params: { locale, homeId } }: { params: { locale: string; homeId: string } }) {
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
  const url = getPath(headers());
  const unfinishedHome = await getUnfinishedHome(homeId, url);
  const { array, innerIndex, outerIndex } = await getStepData("rooms");
  const sellFlatIndex = await getSellFlowIndex("rooms");
  const t = await getScopedI18n("sell.rooms");
  const title = t("title");
  const subtitle = t("subtitle");
  const bedrooms = t("bedrooms");
  const bathrooms = t("bathrooms");
  const livingrooms = t("living-rooms");
  const kitchens = t("kitchens");

  return (
    <Rooms
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      subtitle={subtitle}
      bedrooms_text={bedrooms}
      bathrooms_text={bathrooms}
      livingrooms_text={livingrooms}
      kitchens_text={kitchens}
    />
  );
}
