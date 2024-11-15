import { HomeContextProvider } from "@/context/HomeContext";
import { getHomeById } from "@/app/[locale]/homes/actions";
import Footer from "@/components/Footer";
import { getScopedI18n } from "@/locales/server";
import { findMatching } from "@/lib/utils";
import { featuresMap, typesMap, roomTypesMap, roomStylesMap, propertyStylesMap } from "@/lib/sellFlowData";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { homeId: string } }): Promise<Metadata> {
  const home = await getHomeById(params.homeId);

  return {
    title: `${home?.title} - ${home?.type[0]}` || "Property", // Set the title dynamically
  };
}

type Props = {
  children: React.ReactNode;
  params: { homeId: string; locale: string };
};

export default async function HomeLayout({ children, params: { homeId, locale } }: Readonly<Props>) {
  const [home, f, t, e, rt, rs, ps] = await Promise.all([
    getHomeById(homeId),
    getScopedI18n("sell.features"),
    getScopedI18n("sell.type"),
    getScopedI18n("error"),
    getScopedI18n("home.roomTypes"),
    getScopedI18n("home.roomStyles"),
    getScopedI18n("home.propertyStyles"),
  ]);

  const featuresObject = Array.from({ length: 27 }, (_, index) => ({
    id: featuresMap[index].id,
    name: featuresMap[index].name,
    translation: f(`options.${index}` as keyof typeof f),
  }));

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: t(`options.${index}` as keyof typeof t),
  }));

  const roomTypes = Array.from({ length: 6 }, (_, index) => ({
    id: roomTypesMap[index].id,
    name: roomTypesMap[index].name,
    translation: rt(`options.${index}` as keyof typeof rt),
  }));
  const roomStyles = Array.from({ length: 10 }, (_, index) => ({
    id: roomStylesMap[index].id,
    name: roomStylesMap[index].name,
    translation: rs(`options.${index}` as keyof typeof rs),
  }));
  const propertyStyles = Array.from({ length: 10 }, (_, index) => ({
    id: propertyStylesMap[index].id,
    name: propertyStylesMap[index].name,
    translation: ps(`options.${index}` as keyof typeof ps),
  }));

  const matchingTypes = findMatching(typesObject, home, "type");
  const matchingFeatures = findMatching(featuresObject, home, "features");

  if (home === null) {
    return (
      <div className="flex flex-col">
        <main className="flex flex-col justify-center items-center h-full min-h-screen-minus-header-svh">
          <div className="text-xl">{e("property")}</div>
        </main>
        <footer className="flex justify-center items-center p-6 w-full bg-muted">
          <Footer />
        </footer>
      </div>
    );
  }

  return (
    <>
      <HomeContextProvider
        typesObject={typesObject}
        featuresObject={featuresObject}
        originalHome={home}
        originalMatchingTypes={matchingTypes}
        originalMatchingFeatures={matchingFeatures}
        roomTypes={roomTypes}
        roomStyles={roomStyles}
        propertyStyles={propertyStyles}
      >
        <div className="flex flex-col h-screen-minus-header-dvh w-full">
          <main className="flex-grow overflow-auto h-full">{children}</main>
        </div>
      </HomeContextProvider>
    </>
  );
}
