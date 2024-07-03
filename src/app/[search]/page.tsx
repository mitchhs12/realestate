"use client";
import { useSearchParams } from "next/navigation";

export default async function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  return (
    <main>
      <h1>This is a a test {query}</h1>
    </main>
  );
}
