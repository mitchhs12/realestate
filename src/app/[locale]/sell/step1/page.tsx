import { Metadata } from "next";
import Step1 from "./Step1";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";

export const metadata: Metadata = {
  title: "Step 1",
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/step1");
  const sellFlatIndex = await getSellFlowIndex("/sell/step1");
  const t = await getScopedI18n("sell.step1");
  const step = t("step");
  const title = t("title");
  const subtitle = t("subtitle");

  return (
    <Step1
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      step={step}
      title={title}
      subtitle={subtitle}
    />
  );
}
