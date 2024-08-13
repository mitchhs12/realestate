"use client";

import { getFeatured, getNew } from "@/app/actions";
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
      <div className="grid grid-cols-2 grid-rows-2 sm:grid-rows-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
        {homes.map((home, index) => (
          <div
            key={index}
            className={`flex flex-col rounded-xl h-full w-44 md:w-52 lg:w-52 xl:w-52 space-y-2 shadow-lg dark:shadow-card bg-card`}
          >
            <Card home={home} />
          </div>
        ))}
      </div>
    </div>
  );
}
