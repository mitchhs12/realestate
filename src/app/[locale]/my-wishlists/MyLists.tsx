import { User } from "next-auth";
import ListCard from "@/components/FavoriteComponent/ListCard";
import { getScopedI18n } from "@/locales/server";
import { Button } from "@/components/ui/button";

interface Props {
  user: User;
  typesObject: { id: string; name: string; translation: string }[];
}

export default async function MyLists({ user, typesObject }: Props) {
  const t = await getScopedI18n("my-lists");

  const translations = {
    warning: t("warning"),
    action: t("action"),
    cancel: t("cancel"),
    delete: t("delete"),
    noProperties: t("no-properties"),
    properties: t("properties"),
    empty: t("empty"),
  };
  return (
    <div className="flex flex-col max-w-8xl h-full w-full py-8">
      <div className="px-6 pb-4 overflow-y-auto grid grid-cols-1 2xs:grid-cols-1 w-full h-full xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-center gap-y-12 gap-x-6">
        {user.favoritedLists.map((list) => {
          return <ListCard key={list.id} list={list} translations={translations} />;
        })}
      </div>
    </div>
  );
}
