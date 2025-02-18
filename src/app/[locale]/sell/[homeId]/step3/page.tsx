import { Metadata } from "next";
import Step3 from "./Step3";
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
  title: "Step 3",
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

  const { array, innerIndex, outerIndex } = await getStepData("step3");
  const sellFlatIndex = await getSellFlowIndex("step3");
  const t = await getScopedI18n("sell.step3");
  const step = t("step");
  const title = t("title");
  const subtitle = t("subtitle");

  return (
    <Step3
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
