import { Metadata } from "next";
import SellFlowPage from "./SellFlowPage";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getCurrentLocale } from "@/locales/server";
export const metadata: Metadata = {
  title: "Sell",
};
import { getScopedI18n } from "@/locales/server";

export default async function Page() {
  const session = await getSession();
  const locale = await getCurrentLocale();
  const user = session?.user;
  if (!user) {
    try {
      return <LockedLogin />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/api/auth/signin?callbackUrl=/sell");
    }
  }

  const { array, innerIndex, outerIndex } = await getStepData("/sell");
  const sellFlatIndex = await getSellFlowIndex("/sell");
  const t = await getScopedI18n("sell.sell-flow");

  const title = t("title");
  const titleContinue = t("title-continue");
  const step1 = t("step-1");
  const step1Sub = t("step-1-sub");
  const step2 = t("step-2");
  const step2Sub = t("step-2-sub");
  const step3 = t("step-3");
  const step3Sub = t("step-3-sub");
  const completed = t("completed");

  return (
    <SellFlowPage
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      locale={locale}
      title={title}
      titleContinue={titleContinue}
      step1={step1}
      step1Sub={step1Sub}
      step2={step2}
      step2Sub={step2Sub}
      step3={step3}
      step3Sub={step3Sub}
      completed={completed}
    />
  );
}
