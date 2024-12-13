import { Metadata } from "next";
import Photos from "./Photos";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { getUnfinishedHome } from "../../actions";
import { headers } from "next/headers";
import { getPath } from "@/lib/utils";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Photos",
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
  const { array, innerIndex, outerIndex } = await getStepData("photos");
  const sellFlatIndex = await getSellFlowIndex("photos");
  const t = await getScopedI18n("sell.photos");
  const title = t("title");
  const requirement = t("requirement");
  const photoWarningStarter = t("photo-warning-starter");
  const photoWarningpro = t("photo-warning-pro");
  const photoWarningpremium = t("photo-warning-premium");
  const photoWarningbusiness = t("photo-warning-business");
  const restrictionStarter = t("restriction-starter");
  const restrictionPro = t("restriction-pro");
  const restrictionPremium = t("restriction-premium");
  const restrictionBusiness = t("restriction-business");

  const uploadLimit =
    user.sellerSubscription === "starter"
      ? 5
      : user.sellerSubscription === "pro"
        ? 15
        : user.sellerSubscription === "premium"
          ? 30
          : 50;

  const photoRestrictions = {
    starter: restrictionStarter,
    pro: restrictionPro,
    premium: restrictionPremium,
    business: restrictionBusiness,
  };
  const photoWarnings = {
    starter: photoWarningStarter,
    pro: photoWarningpro,
    premium: photoWarningpremium,
    business: photoWarningbusiness,
  };
  const upgrade = {
    upgradePlan: t("upgrade-plan"),
    upgradeButton: t("upgrade-button"),
  };
  const drag = t("drag");
  const maximum = t("maximum");
  const onlyImages = t("onlyImages");
  const tooNarrow = t("tooNarrow");
  const tooShort = t("tooShort");
  const fileSize = t("fileSize");

  return (
    <Photos
      user={user}
      uploadLimit={uploadLimit}
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      requirement={requirement}
      upgrade={upgrade}
      photoRestrictions={photoRestrictions}
      photoWarnings={photoWarnings}
      drag={drag}
      maximum={maximum}
      onlyImages={onlyImages}
      tooNarrow={tooNarrow}
      tooShort={tooShort}
      fileSize={fileSize}
    />
  );
}
