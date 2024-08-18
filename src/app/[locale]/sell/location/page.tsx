import { Metadata } from "next";
import Location from "./Location";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";

export const metadata: Metadata = {
  title: "Location",
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/location");
  const sellFlatIndex = await getSellFlowIndex("/sell/location");

  return (
    <Location
      user={user}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
    />
  );
}
