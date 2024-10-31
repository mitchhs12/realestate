import { Metadata } from "next";
import SellFlowPage from "../SellFlowPage";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getPath } from "@/lib/utils";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { setStaticParamsLocale } from "next-international/server";
import SelectHomeWrapper from "@/components/SelectHomeModal/Wrapper";

export const metadata: Metadata = {
  title: "Sell Property",
  description:
    "List your property for sale on Viva Ideal and reach buyers globally. Start selling your home, apartment, or land with ease and get discovered by potential buyers.",
};

export default async function Page({ params: { locale, homeId } }: any) {
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
  const unfinishedHomes = user.homes.filter((home) => !home.isComplete);
  const home = user.homes.find((home) => home.id === Number(homeId));
  console.log(home);
  if (!home) {
    return (
      <main className="mx-auto my-10">
        <p className="text-center">Home not found</p>
      </main>
    );
  } else if (home.isComplete === true) {
    // If the home is complete, mount the unfinished homes component
    return <SelectHomeWrapper locale={locale} unfinishedHomes={unfinishedHomes} user={user} />;
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
      currentHome={home}
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
