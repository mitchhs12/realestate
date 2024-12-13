import { Metadata } from "next";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import SelectHomeWrapper from "@/components/SelectHomeModal/Wrapper";
import PricingDialog from "@/components/PricingPageContent/Dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getLanguageAlternates } from "@/lib/utils";
import { HomeType, LanguageType } from "@/lib/validations";
import { setStaticParamsLocale } from "next-international/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ locale: LanguageType }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params;

  const route = "/sell";
  const languageAlternates = getLanguageAlternates(params.locale, route);
  return {
    title: "Sell Your Property",
    description:
      "List your property for sale on Viva Ideal and reach buyers globally. Start selling your home, apartment, or land with ease and get discovered by potential buyers.",

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

export default async function Sell(props: { params: Params }) {
  const params = await props.params;
  const locale = params.locale;
  console.log("sell - locale:", locale);

  // Set the locale early in metadata generation
  setStaticParamsLocale(locale);
  console.log("sell - setStaticParamsLocale called with:", locale);

  const session = await getSession();
  const sell = await getScopedI18n("sell");
  const customMessage = sell("lockedLoginMessage");
  const user = session?.user;
  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${locale}/sell`
      : `https://www.vivaideal.com/${locale}/sell`;

  if (!user) {
    try {
      return <LockedLogin locale={locale} customMessage={customMessage} />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/api/auth/signin?callbackUrl=/sell");
    }
  }
  if (user.sellCredits === 0) {
    try {
      return (
        <Dialog open={true}>
          <DialogContent close={false} className="flex flex-col py-1 px-0 w-[90%] max-w-8xl h-[90%] overflow-y-auto">
            <PricingDialog isCheckout={true} redirectUrl={redirectUrl} />
          </DialogContent>
        </Dialog>
      );
    } catch (error) {
      console.log("Failed to render PricingDialog component:", error);
      redirect("/pricing");
    }
  }

  const unfinishedHomes = user.homes.filter((home: HomeType) => !home.isComplete);

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
  const viewText = t("view");

  const propertiesRemaining = {
    sub: t("properties-remaining.first"),
    year: t("properties-remaining.yearly"),
    month: t("properties-remaining.monthly"),
  };

  const sellFlowText = {
    title,
    titleContinue,
    step1,
    step1Sub,
    step2,
    step2Sub,
    step3,
    step3Sub,
    completed,
    viewText,
  };

  return (
    <SelectHomeWrapper
      locale={locale}
      unfinishedHomes={unfinishedHomes}
      user={user}
      currentHome={null}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      sellFlowText={sellFlowText}
      propertiesRemaining={propertiesRemaining}
    />
  );
}
