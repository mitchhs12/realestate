import { Metadata } from "next";
import SellFlowPage from "../SellFlowPage";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";

import { setStaticParamsLocale } from "next-international/server";
import PricingDialog from "@/components/PricingPageContent/Dialog";
import { LanguageType } from "@/lib/validations";
import { getLanguageAlternates } from "@/lib/utils";

export async function generateMetadata(props: {
  params: Promise<{ locale: LanguageType; homeId: any }>;
}): Promise<Metadata> {
  const params = await props.params;
  const route = `/sell/${params.homeId}`;
  const languageAlternates = getLanguageAlternates(params.locale, route);
  return {
    title: `Sell Property ${params.homeId}`,
    description: "Finish listing your property for sale on Viva Ideal and reach buyers globally.",

    metadataBase: new URL("https://www.vivaideal.com"),
    alternates: {
      canonical: `https://www.vivaideal.com/${params.locale}${route}`,
      languages: languageAlternates,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function Page(props: { params: Promise<{ locale: LanguageType; homeId: string }> }) {
  const params = await props.params;

  const { locale, homeId } = params;

  setStaticParamsLocale(locale);
  const session = await getSession();
  const user = session?.user;

  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${locale}/sell`
      : `https://www.vivaideal.com/${locale}/sell`;

  if (!user) {
    try {
      return <LockedLogin locale={locale} />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/api/auth/signin?callbackUrl=/sell");
    }
  }

  if (!user.sellerSubscription && user.role !== "admin") {
    try {
      return <PricingDialog isCheckout={true} redirectUrl={redirectUrl} />;
    } catch (error) {
      console.log("Failed to render PricingDialog component:", error);
      redirect("/pricing");
    }
  }

  // const unfinishedHomes = user.homes.filter((home) => !home.isComplete);
  const home = user.homes.find((home) => home.id === Number(homeId));
  if (!home) {
    return (
      <main className="mx-auto my-10">
        <p className="text-center">Home not found</p>
      </main>
    );
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
  const view = t("view");

  const propertiesRemaining = {
    sub: t("properties-remaining.first"),
    year: t("properties-remaining.yearly"),
    month: t("properties-remaining.monthly"),
  };

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
      viewText={view}
      propertiesRemaining={propertiesRemaining}
    />
  );
}
