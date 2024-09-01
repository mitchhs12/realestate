import { Metadata } from "next";
import Step2 from "./Step2";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Step 2",
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

  const { array, innerIndex, outerIndex } = await getStepData("/sell/step2");
  const sellFlatIndex = await getSellFlowIndex("/sell/step2");
  const t = await getScopedI18n("sell.step2");

  const step = t("step");
  const title = t("title");
  const subtitle = t("subtitle");

  return (
    <Step2
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      step={step}
      title={title}
      subtitle={subtitle}
    />
  );
}
