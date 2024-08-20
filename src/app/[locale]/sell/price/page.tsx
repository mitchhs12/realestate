import { Metadata } from "next";
import Price from "./Price";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Price",
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/price");
  const sellFlatIndex = await getSellFlowIndex("/sell/price");
  const t = await getScopedI18n("sell.price");
  const title = t("title");
  const subtitle = t("subtitle");
  const negotiable = t("negotiable");
  const price_placeholder = t("price_placeholder");

  return (
    <Price
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      subtitle={subtitle}
      negotiable={negotiable}
      price_placeholder={price_placeholder}
    />
  );
}
