import { Metadata } from "next";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import MyLists from "./MyLists";
import { setStaticParamsLocale } from "next-international/server";
import { getScopedI18n } from "@/locales/server";
import { typesMap } from "@/lib/sellFlowData";

export const metadata: Metadata = {
  title: "My Lists",
};

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
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
      <div className="flex flex-col items-center h-full">
        <MyLists user={user} title={ml("title")} typesObject={typesObject} />
      </div>
    );
  }
}
