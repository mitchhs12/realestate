import { Metadata } from "next";
import Capacity from "./Capacity";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../actions";
import { getPath } from "@/lib/utils";
import { headers } from "next/headers";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Capacity",
};

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
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
  const unfinishedHome = await getUnfinishedHome(url);
  const { array, innerIndex, outerIndex } = await getStepData("/sell/capacity");
  const sellFlatIndex = await getSellFlowIndex("/sell/capacity");
  const t = await getScopedI18n("sell.capacity");

  const title = t("title");
  const subtitle = t("subtitle");
  const size = t("size");
  const metres = t("metres");
  const feet = t("feet");
  const capacity = t("capacity");
  const m = t("units.m");
  const ft = t("units.ft");
  const mPlaceholder = t("m-placeholder");
  const ftPlaceholder = t("ft-placeholder");

  return (
    <Capacity
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      subtitle={subtitle}
      size={size}
      metres={metres}
      feet={feet}
      capacity={capacity}
      m={m}
      ft={ft}
      mPlaceholder={mPlaceholder}
      ftPlaceholder={ftPlaceholder}
    />
  );
}
