import { Metadata } from "next";
import Contact from "./Contact";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { getStepData, getSellFlowIndex } from "@/lib/sellFlowData";
import { getScopedI18n, getCurrentLocale } from "@/locales/server";
import { getPhoneLocale } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
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
  const { array, innerIndex, outerIndex } = await getStepData("/sell/contact");
  const sellFlatIndex = await getSellFlowIndex("/sell/contact");
  const currentLocale = await getCurrentLocale();
  console.log("currentLocale", currentLocale);
  const phoneLocale = await getPhoneLocale(currentLocale);

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

  return (
    <Contact
      user={user}
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
    />
  );
}
