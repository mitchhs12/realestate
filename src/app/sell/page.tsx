import { Metadata } from "next";
import SellFlowPage from "./SellFlowPage";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getHomes } from "./actions";
export const metadata: Metadata = {
  title: "Sell",
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

  console.log(user);

  const { array, innerIndex, outerIndex } = await getStepData("/sell");
  const sellFlatIndex = await getSellFlowIndex("/sell");
  const homes = await getHomes();
  console.log("This user's homes:", homes);

  return (
    <SellFlowPage
      user={user}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
    />
  );
}
