"use client";

import { useSearchParams } from "next/navigation";
import { CoordinatesType } from "@/lib/validations";

export default function SearchResults({ coordinates }: { coordinates: CoordinatesType }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div className="flex w-full">
      <h1>Search Results for {query}</h1>
    </div>
  );
}
