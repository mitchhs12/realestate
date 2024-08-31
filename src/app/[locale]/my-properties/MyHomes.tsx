import { HomeType } from "@/lib/validations";
import { findMatching } from "@/lib/utils";
import ResizableCard from "@/components/ResizableCard";
import { types } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";

interface Props {
  myHomes: HomeType[];
}

export default async function MyHomes({ myHomes }: Props) {
  const t = await getScopedI18n("sell.type");
  const mh = await getScopedI18n("my-properties");

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: types[index],
    translation: t(`options.${index}` as keyof typeof t),
  }));

  return (
    <div className="flex flex-col max-w-7xl h-full w-full">
      <div className="flex w-full h-full justify-center text-2xl items-center py-8">
        <h1>{mh("title")}</h1>
      </div>
      <div className="px-8 pb-4 overflow-y-auto grid grid-cols-2 grid-rows-2 w-full h-full sm:grid-cols-3 sm:grid-rows-1 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {myHomes.map((home, index) => {
          const matchingTypes = findMatching(typesObject, home, "type");

          return (
            <div
              key={index}
              className={`flex flex-col h-full w-full space-y-2  shadow-lg dark:shadow-white/10 rounded-lg`}
            >
              <ResizableCard home={home} types={matchingTypes} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
