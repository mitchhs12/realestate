import { Metadata } from "next";
import Location from "./Location";
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
  title: "Location",
};

export default async function Page(props: { params: Promise<{ locale: string; homeId: string }> }) {
  const params = await props.params;

  const { locale, homeId } = params;

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

  const [stepData, sellFlatIndex, s, t] = await Promise.all([
    getStepData("location"),
    getSellFlowIndex("location"),
    getScopedI18n("home.header.search"),
    getScopedI18n("sell.location"),
  ]);
  const text = s("search-button");
  const placeholder = s("placeholder");
  const placeholderShort = s("placeholder-short");
  const title = t("title");
  const subtitle = t("subtitle");
  const exactText = t("exact");
  const approximateText = t("approximate");

  return (
    <Location
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex: stepData.innerIndex, outerIndex: stepData.outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={stepData.array}
      text={text}
      placeholder={placeholder}
      placeholderShort={placeholderShort}
      title={title}
      subtitle={subtitle}
      exactText={exactText}
      approximateText={approximateText}
    />
  );
}
