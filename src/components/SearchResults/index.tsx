"use client";

import { useSearchParams } from "next/navigation";
import { CoordinatesType } from "@/lib/validations";
import { useContext, useEffect, useState } from "react";
import { QueryContext } from "@/context/QueryContext";
import { Carousel } from "@/components/ui/carousel";

export default function SearchResults({ coordinates }: { coordinates: CoordinatesType }) {
  const { setQuery, query } = useContext(QueryContext);
  const [currentQuery, setCurrentQuery] = useState("");

  useEffect(() => {
    setCurrentQuery(query);
  }, []);

  return (
    <div className="flex w-full">
      <h1>Search Results for {currentQuery}</h1>
    </div>
  );
}
