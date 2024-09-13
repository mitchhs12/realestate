import { Metadata } from "next";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import LockedLogin from "@/components/LockedLogin";
import MyHomes from "./MyHomes";
import { setStaticParamsLocale } from "next-international/server";
import { getScopedI18n } from "@/locales/server";
import { typesMap } from "@/lib/sellFlowData";

export const metadata: Metadata = {
  title: "My Properties",
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
    const [t, mp] = await Promise.all([getScopedI18n("sell.type"), getScopedI18n("my-properties")]);

    const typesObject = Array.from({ length: 17 }, (_, index) => ({
      id: typesMap[index].id,
      name: typesMap[index].name,
      translation: t(`options.${index}` as keyof typeof t),
    }));

    return (
      <div className="flex flex-col items-center h-full">
        <MyHomes
          user={user}
          finishSelling={mp("finishSelling")}
          incompleteListing={mp("incompleteListing")}
          title={mp("title")}
          hideAllText={mp("hideAllText")}
          showAllText={mp("showAllText")}
          typesObject={typesObject}
        />
      </div>
    );
  }
}
