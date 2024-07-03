"use client";

import { useSearchParams } from "next/navigation";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div>
      <h1>Search Results for {query}</h1>
    </div>
  );
}
