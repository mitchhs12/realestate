"use client";
import { findMatching } from "@/lib/utils";
import ResizableCard from "@/components/ResizableCard";
import ToggleAllVisbilityButton from "@/components/ToggleAllVisibilityButton";
import { User } from "next-auth";

interface Props {
  user: User;
  finishSelling: string;
  incompleteListing: string;
  title: string;
  hideAllText: string;
  showAllText: string;
  typesObject: { id: string; name: string; translation: string }[];
  premiumText: string;
}

export default function MyHomes({
  user,
  finishSelling,
  incompleteListing,
  title,
  hideAllText,
  showAllText,
  typesObject,
  premiumText,
}: Props) {
  const activeHomes = user.homes.filter((home) => home.isComplete);
  const allCompletedHomesActive = activeHomes.every((home) => home.isActive);

  return (
    <div className="flex flex-col max-w-8xl h-full w-full pb-8">
      <div className="flex flex-col items-center w-full pb-8">
        <div className="flex w-full h-full justify-center text-2xl items-center py-8">
          <h1>{title}</h1>
        </div>
        <ToggleAllVisbilityButton
          hideAllText={hideAllText}
          showAllText={showAllText}
          allCompletedHomesActive={allCompletedHomesActive}
        />
      </div>
      <div className="p-2 px-4 sm:p-4 md:px-8 overflow-y-auto w-full h-full grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {user.homes.map((home, index) => {
          const matchingTypes = findMatching(typesObject, home, "type");

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
                userId={user.id}
                premiumText={premiumText}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
