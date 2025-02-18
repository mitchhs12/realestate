import { Metadata } from "next";
import Capacity from "./Capacity";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../../actions";
import { getPath } from "@/lib/utils";
import { headers } from "next/headers";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Capacity",
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
  const { array, innerIndex, outerIndex } = await getStepData("capacity");
  const sellFlatIndex = await getSellFlowIndex("capacity");
  const t = await getScopedI18n("sell.capacity");
  const h = await getScopedI18n("homes.units");

  const title = t("title");
  const subtitle = t("subtitle");
  const size = t("size");
  const capacity = t("capacity");
  const m = t("units.m");
  const ft = t("units.ft");
  const mPlaceholder = t("m-placeholder");
  const ftPlaceholder = t("ft-placeholder");
  const changeToFeet = t("change-to-feet");
  const changeToMetres = t("change-to-metres");

  return (
    <Capacity
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      subtitle={subtitle}
      size={size}
      capacity={capacity}
      m={m}
      ft={ft}
      mPlaceholder={mPlaceholder}
      ftPlaceholder={ftPlaceholder}
      changeToFeet={changeToFeet}
      changeToMetres={changeToMetres}
    />
  );
}
