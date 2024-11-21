import { Metadata } from "next";
import Contact from "./Contact";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n, getCurrentLocale } from "@/locales/server";
import { getPhoneLocale } from "@/lib/utils";
import { getUnfinishedHome } from "../../actions";
import { getPath } from "@/lib/utils";
import { headers } from "next/headers";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function Page({ params: { locale, homeId } }: { params: { locale: string; homeId: string } }) {
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
  const unfinishedHome = await getUnfinishedHome(homeId, url);

  const { array, innerIndex, outerIndex } = await getStepData("contact");
  const sellFlatIndex = await getSellFlowIndex("contact");
  const phoneLocale = await getPhoneLocale(locale);

  const t = await getScopedI18n("sell.contact");
  const title = t("title");
  const subtitle = t("subtitle");
  const name_placeholder = t("name-placeholder");
  const name_text = t("name");
  const email_placeholder = t("email-placeholder");
  const email_text = t("email");
  const mobile_placeholder = t("mobile-placeholder");
  const mobile_text = t("mobile");
  const mobile_check = t("mobile-check");
  const noCountry = t("no-country");
  const searchCountry = t("search-country");

  return (
    <Contact
      user={user}
      currentHome={unfinishedHome}
      sellFlowIndices={{ innerIndex, outerIndex }}
      sellFlatIndex={sellFlatIndex}
      stepPercentage={array}
      title={title}
      subtitle={subtitle}
      name_text={name_text}
      name_placeholder={name_placeholder}
      email_text={email_text}
      email_placeholder={email_placeholder}
      mobile_text={mobile_text}
      mobile_placeholder={mobile_placeholder}
      mobile_check={mobile_check}
      phoneList={phoneLocale}
      noCountry={noCountry}
      searchCountry={searchCountry}
    />
  );
}
