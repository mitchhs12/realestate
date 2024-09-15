import { User } from "next-auth";
import ListCard from "@/components/FavoriteComponent/ListCard";
import { getScopedI18n } from "@/locales/server";

interface Props {
  user: User;
  title: string;
  typesObject: { id: string; name: string; translation: string }[];
}

export default async function MyLists({ user, title, typesObject }: Props) {
  const t = await getScopedI18n("my-lists");

  const translations = {
    warning: t("warning"),
    action: t("action"),
    cancel: t("cancel"),
    delete: t("delete"),
    noProperties: t("no-properties"),
  };
  return (
    <div className="flex flex-col max-w-8xl h-full w-full">
      <div className="flex flex-col items-center w-full pb-8">
        <div className="flex w-full h-full justify-center text-2xl items-center py-8">
          <h1>{title}</h1>
        </div>
      </div>
      <div className="px-8 pb-4 overflow-y-auto grid grid-cols-1 2xs:grid-cols-1 grid-rows-2 w-full h-full xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-y-12 gap-x-6">
        {user.favoritedLists.map((list) => {
          return <ListCard list={list} translations={translations} />;
        })}
      </div>
    </div>
  );
}
