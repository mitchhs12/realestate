"use client";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <main>
      <h1>Showing search results for location: {query}</h1>
    </main>
  );
}
