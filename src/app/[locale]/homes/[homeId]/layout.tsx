import { HomeContextProvider } from "@/context/HomeContext";
import { getHomeById } from "@/app/[locale]/homes/actions";
import Footer from "@/components/Footer";
import { getScopedI18n } from "@/locales/server";
import { findMatching } from "@/lib/utils";
import { features, types } from "@/lib/sellFlowData";
import lookup from "country-code-lookup";
import { Country } from "react-phone-number-input";
import { getPhoneLocale, PhoneLocale } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  params: { homeId: string; locale: string };
};

export default async function HomeLayout({ children, params: { homeId, locale } }: Readonly<Props>) {
  const [home, f, t] = await Promise.all([
    getHomeById(homeId),
    getScopedI18n("sell.features"),
    getScopedI18n("sell.type"),
  ]);

  const featuresObject = Array.from({ length: 26 }, (_, index) => ({
    id: features[index],
    translation: f(`options.${index}` as keyof typeof f),
  }));

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: types[index],
    translation: t(`options.${index}` as keyof typeof t),
  }));

  const matchingTypes = findMatching(typesObject, home, "type");
  const matchingFeatures = findMatching(featuresObject, home, "features");

  if (home === null) {
    return (
      <div>
        <main>
          <div className="flex justify-center text-xl">Something went wrong fetching this home.</div>
        </main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
      </div>
    );
  }

  return (
    <>
      <HomeContextProvider home={home} matchingTypes={matchingTypes} matchingFeatures={matchingFeatures}>
        <div className="flex flex-col h-screen-minus-header-dvh w-full">
          <main className="flex-grow overflow-auto h-full">{children}</main>
        </div>
      </HomeContextProvider>
    </>
  );
}
