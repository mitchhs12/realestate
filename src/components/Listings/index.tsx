"use client";
import ResizableCard from "@/components/ResizableCard";
import { findMatching } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getCheapest, getNew, getPopular } from "@/app/[locale]/actions";
import { HomeType } from "@/lib/validations";

interface Props {
  listingKey: string;
  typesObject: { id: string; name: string; translation: string }[];
  loginToViewPrice: string;
  premiumText: string;
}

export default function Listings({ listingKey, typesObject, loginToViewPrice, premiumText }: Props) {
  const [homes, setHomes] = useState<(HomeType | null)[]>([null, null, null, null, null, null]);

  useEffect(() => {
    if (listingKey === "popular") {
      getPopular().then((homes) => setHomes(homes));
    } else if (listingKey === "cheapest") {
      getCheapest().then((homes) => setHomes(homes));
    } else {
      getNew().then((homes) => setHomes(homes));
    }
  }, [listingKey]);

  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="grid p-2 sm:p-4 md:px-8 w-full h-full grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-2 sm:gap-4 lg:gap-5">
        {homes.map((home, index) => {
          const matchingTypes = findMatching(typesObject, home, "type");

          return (
            <div
              key={index}
              className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-white/10 rounded-lg
                ${index >= 3 && "hidden 2xs:block"}
                ${index >= 4 && "2xs:hidden sm:block"}
                ${index >= 4 && "sm:hidden md:block"}
                ${index >= 6 && "md:hidden lg:block"}
                ${index >= 4 && "lg:hidden xl:block"}
                ${index >= 5 && "xl:hidden"}
              `}
            >
              <ResizableCard
                home={home}
                types={matchingTypes}
                loginToViewPrice={loginToViewPrice}
                premiumText={premiumText}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
