"use client";

import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { Carousel } from "@/components/ui/carousel";
import { BoundsType } from "@/lib/validations";
import { HomeType } from "@/lib/validations";

interface Props {
  homes: HomeType[];
}

export default function SearchResults({ homes }: Props) {
  const { setQuery, query } = useContext(QueryContext);
  const [currentQuery, setCurrentQuery] = useState("");

  useEffect(() => {
    setCurrentQuery(query);
  }, []);

  return (
    <div className="flex w-full">
      <h1>Search Results for {currentQuery}</h1>
      <div>
        {homes.map((home, index) => (
          <div key={index}>
            <h2>{home.title}</h2>
            <p>{home.description}</p>
            <p>{home.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
