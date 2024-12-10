import { HomeContextProvider } from "@/context/HomeContext";
import { getHomeById } from "@/app/[locale]/homes/actions";
import Footer from "@/components/Footer";
import { getScopedI18n } from "@/locales/server";
import { findMatching } from "@/lib/utils";
import { featuresMap, typesMap } from "@/lib/sellFlowData";
import { Metadata } from "next";

import { LanguageType } from "@/lib/validations";
import { getLanguageAlternates } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { locale: LanguageType; homeId: string };
}): Promise<Metadata> {
  const route = `/homes/${params.homeId}`;
  const languageAlternates = getLanguageAlternates(params.locale, route);

  const home = await getHomeById(params.homeId);

  const homeTitle = home?.title || "Property Not Found";
  const homeType = home?.type?.[0] || "Unknown Type";
  const homeDescription = home?.description || "This property could not be found.";
  const placeholderImage = `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/placeholder/light4.jpg`; // Placeholder image URL
  const homePhotos = home?.photos || [placeholderImage];

  return {
    title: `${homeTitle} - ${homeType}`,
    description: homeDescription,
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
    openGraph: {
      title: homeTitle,
      description: homeDescription,
      url: `https://www.vivaideal.com/${params.locale}/homes/${params.homeId}`,
      type: "website",
      images: [
        {
          url: homePhotos[0],
          width: 1200,
          height: 630,
          alt: homeTitle,
        },
      ],
    },
  };
}

type Props = {
  children: React.ReactNode;
  params: { homeId: string; locale: string };
};

export default async function HomeLayout({ children, params: { homeId, locale } }: Readonly<Props>) {
  const [home, f, t, e] = await Promise.all([
    getHomeById(homeId),
    getScopedI18n("sell.features"),
    getScopedI18n("sell.type"),
    getScopedI18n("error"),
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
      >
        <div className="flex flex-col h-screen-minus-header-dvh w-full">
          <main className="flex-grow overflow-auto h-full">{children}</main>
        </div>
      </HomeContextProvider>
    </>
  );
}
