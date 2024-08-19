import { Metadata } from "next";
import Features from "./Features";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { features } from "@/lib/sellFlowData";

export const metadata: Metadata = {
  title: "Features",
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

  const { array, innerIndex, outerIndex } = await getStepData("/sell/features");
  const sellFlatIndex = await getSellFlowIndex("/sell/features");
  const t = await getScopedI18n("sell.features");
  const title = t("title");
  const subtitle = t("subtitle");
  const options = Array.from({ length: 16 }, (_, index) => ({
    id: features[index],
    translation: t(`options.${index}` as keyof typeof t),
  }));

  return (
    <Features
      user={user}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      subtitle={subtitle}
      options={options}
    />
  );
}
