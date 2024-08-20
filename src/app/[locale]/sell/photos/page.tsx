import { Metadata } from "next";
import Photos from "./Photos";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Photos",
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/photos");
  const sellFlatIndex = await getSellFlowIndex("/sell/photos");
  const t = await getScopedI18n("sell.photos");
  const title = t("title");
  const requirement = t("requirement");
  const restriction = t("restriction");
  const drag = t("drag");
  const maximum = t("maximum");
  const onlyImages = t("onlyImages");
  const tooNarrow = t("tooNarrow");
  const tooShort = t("tooShort");
  const fileSize = t("fileSize");
  console.log(restriction);

  return (
    <Photos
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      requirement={requirement}
      restriction={restriction}
      drag={drag}
      maximum={maximum}
      onlyImages={onlyImages}
      tooNarrow={tooNarrow}
      tooShort={tooShort}
      fileSize={fileSize}
    />
  );
}
