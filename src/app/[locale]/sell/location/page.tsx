import { Metadata } from "next";
import Location from "./Location";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Location",
};

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
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
  const unfinishedHome = await getUnfinishedHome(url);

  const [stepData, sellFlatIndex, s, t] = await Promise.all([
    getStepData("/sell/location"),
    getSellFlowIndex("/sell/location"),
    getScopedI18n("home.header.search"),
    getScopedI18n("sell.location"),
  ]);
  const text = s("search-button");
  const placeholder = s("placeholder");
  const title = t("title");
  const subtitle = t("subtitle");

  return (
    <Location
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex: stepData.innerIndex, outerIndex: stepData.outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={stepData.array}
      text={text}
      placeholder={placeholder}
      title={title}
      subtitle={subtitle}
    />
  );
}
