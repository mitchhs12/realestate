import { Metadata } from "next";
import Title from "./Title";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";

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
  const url = getPath(headers());
  const unfinishedHome = await getUnfinishedHome(url);
  const { array, innerIndex, outerIndex } = await getStepData("/sell/title");
  const sellFlatIndex = await getSellFlowIndex("/sell/title");
  const t = await getScopedI18n("sell.title");
  const title = t("title");
  const subtitle = t("subtitle");
  const warning = t("warning");

  return (
    <Title
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title_text={title}
      subtitle={subtitle}
      warning={warning}
    />
  );
}
