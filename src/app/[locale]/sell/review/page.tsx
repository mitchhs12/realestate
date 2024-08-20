import { Metadata } from "next";
import Review from "./Review";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Review",
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/review");
  const sellFlatIndex = await getSellFlowIndex("/sell/review");

  return (
    <Review
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
    />
  );
}
