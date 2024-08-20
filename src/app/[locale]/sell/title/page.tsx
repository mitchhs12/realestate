import { Metadata } from "next";
import Title from "./Title";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";

export const metadata: Metadata = {
  title: "Title",
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/title");
  const sellFlatIndex = await getSellFlowIndex("/sell/title");
  const t = await getScopedI18n("sell.title");
  const title = t("title");
  const subtitle = t("subtitle");
  const warning = t("warning");

  return (
    <Title
      user={user}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title_text={title}
      subtitle={subtitle}
      warning={warning}
    />
  );
}
