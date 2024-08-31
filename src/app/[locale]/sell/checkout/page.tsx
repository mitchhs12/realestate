import { Metadata } from "next";
import Checkout from "./Checkout";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/checkout");
  const sellFlatIndex = await getSellFlowIndex("/sell/checkout");
  const t = await getScopedI18n("sell.checkout");

  const checkoutData = {
    title: t("title"),
    subtitle: t("subtitle"),
    premium: {
      title: t("premium.title"),
      subtitle: t("premium.subtitle"),
      anchor: 100.0,
      price: 29.99,
      perks: [
        {
          title: t("premium.perks.0.title"),
          subtitle: t("premium.perks.0.subtitle"),
        },
        {
          title: t("premium.perks.1.title"),
          subtitle: t("premium.perks.1.subtitle"),
        },
        {
          title: t("premium.perks.2.title"),
          subtitle: t("premium.perks.2.subtitle"),
        },
      ],
    },
    standard: {
      title: t("standard.title"),
      subtitle: t("standard.subtitle"),
      price: t("standard.price"),
      perks: [
        {
          title: t("standard.perks.0.title"),
          subtitle: t("standard.perks.0.subtitle"),
        },
        {
          title: t("standard.perks.1.title"),
          subtitle: t("standard.perks.1.subtitle"),
        },
        {
          title: t("standard.perks.2.title"),
          subtitle: t("standard.perks.2.subtitle"),
        },
      ],
    },
  };

  return (
    <Checkout
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={checkoutData.title}
      subtitle={checkoutData.subtitle}
      premium={checkoutData.premium}
      standard={checkoutData.standard}
    />
  );
}
