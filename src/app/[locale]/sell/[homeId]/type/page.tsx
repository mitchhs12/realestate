import { Metadata } from "next";
import Type from "./Type";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { typesMap } from "@/lib/sellFlowData";
import { getUnfinishedHome } from "../../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Type",
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
  const { array, innerIndex, outerIndex } = await getStepData("type");
  const sellFlatIndex = await getSellFlowIndex("type");
  const t = await getScopedI18n("sell.type");
  const title = t("title");
  const subtitle = t("subtitle");
  const options = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: t(`options.${index}` as keyof typeof t),
  }));

  return (
    <Type
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
