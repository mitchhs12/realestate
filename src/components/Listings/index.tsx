"use client";

import { getFeatured, getNew } from "@/app/[locale]/actions";
import { useState, useEffect } from "react";
import { HomeType } from "@/lib/validations";
import Card from "@/components/Card";

interface Props {
  type: string;
}

export default function Listings({ type }: Props) {
  const [homes, setHomes] = useState<(HomeType | null)[]>([null, null, null, null, null, null]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let data;
        if (type === "featured") {
          data = await getFeatured();
        } else {
          // type === 'new'
          data = await getNew();
        }
        // Update the homes state with the fetched data
        setHomes(data.map((home: HomeType) => home || null));
      } catch (error) {
        console.error(`Error fetching ${type} properties:`, error);
      }
    };

    fetchProperties();
  }, [type]);

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div className="grid grid-cols-2 grid-rows-2 sm:grid-cols-3 sm:grid-rows-1 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-6 xl:grid-rows-1 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {homes.map((home, index) => (
          <div
            key={index}
            className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-card bg-card rounded-xl
              ${index >= 4 && "hidden sm:block"}
              ${index >= 3 && "sm:hidden lg:block"}
              ${index >= 4 && "lg:hidden xl:block"}
            `}
          >
            <Card home={home} />
          </div>
        ))}
      </div>
    </div>
  );
}
