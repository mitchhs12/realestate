import { Metadata } from "next";
import Description from "./Description";
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
  title: "Description",
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
  const { array, innerIndex, outerIndex } = await getStepData("description");
  const sellFlatIndex = await getSellFlowIndex("description");
  const t = await getScopedI18n("sell.description");
  const title = t("title");
  const placeholder = t("placeholder");
  const subtitle = t("subtitle");
  const warning = t("warning");

  return (
    <Description
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      subtitle={subtitle}
      warning={warning}
      placeholder={placeholder}
    />
  );
}
