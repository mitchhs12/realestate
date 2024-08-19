import { Metadata } from "next";
import Rooms from "./Rooms";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";

export const metadata: Metadata = {
  title: "Rooms",
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/rooms");
  const sellFlatIndex = await getSellFlowIndex("/sell/rooms");
  const t = await getScopedI18n("sell.rooms");
  const title = t("title");
  const subtitle = t("subtitle");
  const bedrooms = t("bedrooms");
  const bathrooms = t("bathrooms");
  const livingrooms = t("living-rooms");
  const kitchens = t("kitchens");

  return (
    <Rooms
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
