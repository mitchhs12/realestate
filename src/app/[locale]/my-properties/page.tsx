import { Metadata } from "next";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import MyHomes from "./MyHomes";
import { setStaticParamsLocale } from "next-international/server";
import { getScopedI18n } from "@/locales/server";
import { typesMap } from "@/lib/sellFlowData";
import Footer from "@/components/Footer";
import Image from "next/image";
import Title from "./Title";
import { languages } from "@/lib/validations";

const languageAlternates = languages.reduce((acc: any, lang) => {
  acc[lang] = `/${lang}/homes`;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "My Properties",
  description: "My Properties that I have listed for sale on Viva Ideal",
  metadataBase: new URL("https://www.vivaideal.com/my-properties"),
  alternates: {
    canonical: "/data",
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

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const {
    locale
  } = params;

  setStaticParamsLocale(locale);
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    try {
      return <LockedLogin locale={locale} />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/");
    }
  } else if (user && user.id) {
    const [t, mp, p] = await Promise.all([
      getScopedI18n("sell.type"),
      getScopedI18n("my-properties"),
      getScopedI18n("sell.checkout.premium"),
    ]);

    const typesObject = Array.from({ length: 17 }, (_, index) => ({
      id: typesMap[index].id,
      name: typesMap[index].name,
      translation: t(`options.${index}` as keyof typeof t),
    }));

    const cardTextObject = {
      properties: mp("properties"),
      favorites: mp("favorites"),
      views: mp("views"),
      propertiesDescription: mp("properties-description"),
      favoritesDescription: mp("favorites-description"),
      viewsDescription: mp("views-description"),
    };

    const selectionObject = {
      orderBy: mp("order-by"),
      date: mp("date"),
      favorited: mp("favorited"),
      price: mp("price"),
      incomplete: mp("incomplete"),
      visible: mp("visible"),
    };

    return (
      <div className="flex flex-col items-center h-full justify-center">
        <div className="flex flex-col h-full w-full min-h-screen-minus-header-svh items-center">
          <div className="relative h-[20vh] flex w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/banner5.webp`}
              alt="background"
              fill={true}
              style={{ objectFit: "cover" }}
              quality={70}
              priority={true}
              sizes="(max-width: 400px) 400px,
            (max-width: 510px) 510px,
            (max-width: 768px) 768px, 
            (max-width: 1024px) 1024px, 
            (max-width: 1280px) 1280px, 
            (max-width: 1536px) 1536px,
            (max-width: 1920px) 1920px,
            100vw"
              className="-z-10 opacity-30 dark:opacity-20"
            />
            <Title locale={locale} title={mp("title")} />
          </div>
          <MyHomes
            user={user}
            finishSelling={mp("finishSelling")}
            incompleteListing={mp("incompleteListing")}
            hideAllText={mp("hideAllText")}
            showAllText={mp("showAllText")}
            typesObject={typesObject}
            premiumText={p("title")}
            cardText={cardTextObject}
            selection={selectionObject}
          />
        </div>
        <footer className="flex justify-center items-center p-6 w-full bg-zinc-50 dark:bg-zinc-950">
          <Footer />
        </footer>
      </div>
    );
  }
}
