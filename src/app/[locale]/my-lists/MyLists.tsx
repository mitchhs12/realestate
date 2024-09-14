"use client";
import { findMatching } from "@/lib/utils";
import ResizableCard from "@/components/ResizableCard";
import { totalLengthOfAllSteps } from "@/lib/sellFlowData";
import ToggleAllVisbilityButton from "@/components/ToggleAllVisibilityButton";
import { QueryContext } from "@/context/QueryContext";
import { useContext } from "react";
import { User } from "next-auth";

interface Props {
  user: User;
  title: string;
  deleteText: string;
  typesObject: { id: string; name: string; translation: string }[];
}

export default function MyLists({ user, title, deleteText, typesObject }: Props) {
  const activeHomes = user.homes.filter((home) => home.isComplete);
  const allCompletedHomesActive = activeHomes.every((home) => home.isActive);

  return (
    <div className="flex flex-col max-w-8xl h-full w-full">
      <div className="flex flex-col items-center w-full pb-8">
        <div className="flex w-full h-full justify-center text-2xl items-center py-8">
          <h1>{title}</h1>
        </div>
      </div>
      <div className="px-8 pb-4 overflow-y-auto grid grid-cols-1 2xs:grid-cols-1 grid-rows-2 w-full h-full xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {user.homes.map((home, index) => {
          const matchingTypes = findMatching(typesObject, home, "type");
          return (
            <div
              key={index}
              className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-white/10 rounded-lg`}
            >
              <ResizableCard home={home} types={matchingTypes} userId={user.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
