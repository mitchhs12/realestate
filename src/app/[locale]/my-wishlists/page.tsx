import { Metadata } from "next";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import MyLists from "./MyLists";
import { setStaticParamsLocale } from "next-international/server";
import { getScopedI18n } from "@/locales/server";
import { typesMap } from "@/lib/sellFlowData";
import Footer from "@/components/Footer";
import Image from "next/image";
import Title from "./Title";

export const metadata: Metadata = {
  title: "My Lists",
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
    const [t, ml] = await Promise.all([getScopedI18n("sell.type"), getScopedI18n("my-lists")]);

    const typesObject = Array.from({ length: 17 }, (_, index) => ({
      id: typesMap[index].id,
      name: typesMap[index].name,
      translation: t(`options.${index}` as keyof typeof t),
    }));

    return (
      <>
        <div className="flex flex-col items-center h-full min-h-screen-minus-header-svh">
          <div className="relative h-[20vh] flex w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/home/banners/banner6.webp`}
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
            <Title locale={locale} title={ml("title")} />
          </div>
          <MyLists user={user} typesObject={typesObject} />
        </div>
        <footer className="flex justify-center items-center p-6 w-full bg-zinc-50 dark:bg-zinc-950">
          <Footer />
        </footer>
      </>
    );
  }
}
