"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useRef } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (query) {
      router.push(`search?query=${encodeURIComponent(query)}`);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <form className="flex w-full max-w-sm items-center space-x-2" onSubmit={handleSearch}>
      <Input
        ref={inputRef}
        type="search"
        placeholder={pathname === "/search" && searchQuery ? searchQuery : "Search Locations"}
        className="bg-muted"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
