import { Metadata } from "next";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import { setStaticParamsLocale } from "next-international/server";
import { getScopedI18n } from "@/locales/server";
import { typesMap } from "@/lib/sellFlowData";
import List from "@/app/[locale]/my-wishlists/[listId]/List";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Specific List",
};

export default async function Page({ params }: { params: { locale: string; listId: number } }) {
  setStaticParamsLocale(params.locale);

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    try {
      return <LockedLogin locale={params.locale} />;
    } catch (error) {
      console.error("Failed to render LockedLogin component:", error);
      redirect("/");
    }
  } else if (user && user.id) {
    const t = await getScopedI18n("sell.type");
    const p = await getScopedI18n("sell.checkout.premium");
    const h = await getScopedI18n("home.header");

    const typesObject = Array.from({ length: 17 }, (_, index) => ({
      id: typesMap[index].id,
      name: typesMap[index].name,
      translation: t(`options.${index}` as keyof typeof t),
    }));

    const list = user.favoritedLists.find((list: any) => list.id === Number(params.listId));
    return (
      <>
        <div className="flex flex-col items-center h-full min-h-screen-minus-header-svh">
          <List list={list} types={typesObject} premiumText={p("title")} listText={h("list")} />
        </div>
        <footer className="flex justify-center items-center p-6 w-full bg-zinc-50 dark:bg-zinc-950">
          <Footer />
        </footer>
      </>
    );
  }
}
