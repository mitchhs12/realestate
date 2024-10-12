import { Metadata } from "next";
import Features from "./Features";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { featuresMap } from "@/lib/sellFlowData";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Features",
};

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
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

  const url = getPath(headers());
  const unfinishedHome = await getUnfinishedHome(url);
  const { array, innerIndex, outerIndex } = await getStepData("/sell/features");
  const sellFlatIndex = await getSellFlowIndex("/sell/features");
  const t = await getScopedI18n("sell.features");
  const title = t("title");
  const subtitle = t("subtitle");
  const options = Array.from({ length: 27 }, (_, index) => ({
    id: featuresMap[index].id,
    name: featuresMap[index].name,
    translation: t(`options.${index}` as keyof typeof t),
  }));

  return (
    <Features
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      subtitle={subtitle}
      options={options}
    />
  );
}
