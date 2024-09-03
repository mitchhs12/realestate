import { HomeType } from "@/lib/validations";
import ResizableCard from "@/components/ResizableCard";
import { getScopedI18n } from "@/locales/server";
import { findMatching } from "@/lib/utils";
import { types } from "@/lib/sellFlowData";

interface Props {
  homes: HomeType[];
}

export default async function Listings({ homes }: Props) {
  const [t, p] = await Promise.all([getScopedI18n("sell.type"), getScopedI18n("search")]);
  const loginToViewPrice = p("loginToViewPrices");

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: types[index],
    translation: t(`options.${index}` as keyof typeof t),
  }));

  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="grid grid-cols-2 grid-rows-2 p-8 w-full h-full sm:grid-cols-3 sm:grid-rows-1 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {homes.map((home, index) => {
          const matchingTypes = findMatching(typesObject, home, "type");

          return (
            <div
              key={index}
              className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-white/10 rounded-lg
                ${index >= 4 && "hidden sm:block"}
                ${index >= 3 && "sm:hidden lg:block"}
                ${index >= 4 && "lg:hidden xl:block"}
              `}
            >
              <ResizableCard home={home} types={matchingTypes} loginToViewPrice={loginToViewPrice} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
