"use client";

import { useSearchParams } from "next/navigation";
import { CoordinatesType } from "@/lib/validations";
import { useContext } from "react";
import { QueryContext } from "@/context/QueryContext";

export default function SearchResults({ coordinates }: { coordinates: CoordinatesType }) {
  const { setQuery, query } = useContext(QueryContext);

  return (
    <div className="flex w-full">
      <h1>Search Results for {query}</h1>
    </div>
  );
}
