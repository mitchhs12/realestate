import { Metadata } from "next";
import SettingsPage from "./SettingsPage";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { LanguageType } from "@/lib/validations";
import { GetFullSubscription } from "../stripeServer";
import { languages } from "@/lib/validations";
import { getLanguageAlternates } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { locale: LanguageType } }): Promise<Metadata> {
  const route = "/settings";
  const languageAlternates = getLanguageAlternates(params.locale, route);
  return {
    title: "Settings",
    description: "Viva Ideal Account Settings",

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

export default async function Page({ params: { locale } }: { params: { locale: LanguageType } }) {
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("settings");
  const title = t("title");
  const name_title = t("name.title");
  const name_sub = t("name.subtitle");
  const currency_title = t("currency.title");
  const currency_sub = t("currency.subtitle");
  const language_title = t("language.title");
  const language_sub = t("language.subtitle");
  const submit = t("submit");
  const name = { title: name_title, subtitle: name_sub };
  const currency = { title: currency_title, subtitle: currency_sub };
  const language = { title: language_title, subtitle: language_sub };

  const billingText = {
    title: t("billing.title"),
    buyerSubscription: t("billing.Buyer Subscription"),
    sellerSubscription: t("billing.Seller Subscription"),
    updateSub: t("billing.updateSub"),
    paymentMethods: t("billing.paymentMethods"),
    cancel: t("billing.cancel"),
    contactCredits: t("billing.contact-credits"),
    contactCreditsDesc: t("billing.contact-credits-description"),
    sellCredits: t("billing.seller-credits"),
    sellCreditsDesc: t("billing.seller-credits-description"),
    subscriptions: t("billing.view-subscriptions"),
    accountType: t("billing.account-type"),
    accountTypeDescription: t("billing.account-type-description"),
    changeToBuyer: t("billing.change-to-buyer"),
    changeToSeller: t("billing.change-to-seller"),
    buyer: t("billing.buyer"),
    seller: t("billing.seller"),
  };

  const session = await getSession();

  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/settings");
  }

  let buyerSubscription = null;
  let sellerSubscription = null;
  if (user.buyerSubscriptionId) {
    buyerSubscription = await GetFullSubscription(user.buyerSubscriptionId);
  }
  if (user.sellerSubscriptionId) {
    sellerSubscription = await GetFullSubscription(user.sellerSubscriptionId);
  }

  return (
    <SettingsPage
      user={user}
      title={title}
      name={name}
      currency={currency}
      language={language}
      submit={submit}
      buyerSubscription={buyerSubscription}
      sellerSubscription={sellerSubscription}
      billingText={billingText}
    />
  );
}
