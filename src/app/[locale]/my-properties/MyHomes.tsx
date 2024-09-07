import { HomeType } from "@/lib/validations";
import { findMatching } from "@/lib/utils";
import ResizableCard from "@/components/ResizableCard";
import { typesMap } from "@/lib/sellFlowData";
import { getScopedI18n } from "@/locales/server";
import { totalLengthOfAllSteps } from "@/lib/sellFlowData";
import ToggleAllVisbilityButton from "@/components/ToggleAllVisibilityButton";

interface Props {
  myHomes: HomeType[];
  userId: string;
}

export default async function MyHomes({ myHomes, userId }: Props) {
  const [t, mp] = await Promise.all([getScopedI18n("sell.type"), getScopedI18n("my-properties")]);

  const finishSelling = mp("finishSelling");
  const incompleteListing = mp("incompleteListing");

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: t(`options.${index}` as keyof typeof t),
  }));
  const hideAllText = mp("hideAllText");
  const showAllText = mp("showAllText");
  const activeHomes = myHomes.filter((home) => home.isComplete);
  const allCompletedHomesActive = activeHomes.every((home) => home.isActive);

  return (
    <div className="flex flex-col max-w-8xl h-full w-full">
      <div className="flex flex-col items-center w-full pb-8">
        <div className="flex w-full h-full justify-center text-2xl items-center py-8">
          <h1>{mp("title")}</h1>
        </div>
        <ToggleAllVisbilityButton
          hideAllText={hideAllText}
          showAllText={showAllText}
          allCompletedHomesActive={allCompletedHomesActive}
        />
      </div>
      <div className="px-8 pb-4 overflow-y-auto grid grid-cols-1 2xs:grid-cols-1 grid-rows-2 w-full h-full xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {myHomes.map((home, index) => {
          const matchingTypes = findMatching(typesObject, home, "type");

          if (home.listingFlowStep < totalLengthOfAllSteps - 1) {
            return (
              <div
                key={index}
                className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-white/10 rounded-lg`}
              >
                <ResizableCard
                  home={home}
                  finishSelling={finishSelling}
                  incompleteListing={incompleteListing}
                  types={matchingTypes}
                  userId={userId}
                />
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-white/10 rounded-lg`}
              >
                <ResizableCard
                  home={home}
                  finishSelling={finishSelling}
                  incompleteListing={incompleteListing}
                  types={matchingTypes}
                  userId={userId}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
