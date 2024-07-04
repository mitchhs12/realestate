"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useContext } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { v4 as uuidv4 } from "uuid"; // Import UUID for session token
import { ReloadIcon } from "@radix-ui/react-icons";
import { QueryContext } from "@/context/QueryContext";

interface PlacePrediction {
  text: {
    text: string;
  };
}

interface Result {
  placePrediction: PlacePrediction;
}

export default function SearchBox() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false); // State to control Popover open
  const debounceTimeout = useRef<number | null>(null); // Ref for debounce timeout
  const sessionTokenRef = useRef<string>(uuidv4()); // Ref for session token
  const { query, updateQuery } = useContext(QueryContext);
  const initialQueryRef = useRef(query);

  const handleSearch = (searchParam: string | undefined) => {
    if (searchParam) {
      console.log("queryb4navigation", query);
      router.push(`search?query=${encodeURIComponent(searchParam)}`);
      setPopoverOpen(false); // Close Popover on search
    }
  };

  useEffect(() => {
    if (query === initialQueryRef.current) return;

    console.log("after navigation", query);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (query) {
      debounceTimeout.current = window.setTimeout(() => {
        fetchPlaces(query, sessionTokenRef.current);
      }, 300); // Debounce fetching places
    } else {
      setPopoverOpen(false); // Close Popover if query is empty
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchPlaces = async (query: string, sessionToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/places?query=${encodeURIComponent(query)}&sessionToken=${sessionToken}`);
      const results = await response.json();
      if (results.data) {
        setResults(results.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setResults([]);
    }
    setLoading(false);
    setPopoverOpen(true);
  };

  return (
    <div className="flex">
      <form
        className="flex max-w-full items-top space-x-2"
        onSubmit={() => handleSearch(results[0].placePrediction.text.text)}
      >
        <Popover open={popoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex w-full">
              <Input
                ref={inputRef}
                type="search"
                placeholder={"Search Locations"}
                className="bg-muted w-96"
                value={query}
                onMouseDown={() => results.length > 0 && query && setPopoverOpen(true)} // Open Popover on mouse down if there are results
                onChange={(e) => {
                  updateQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  !loading && e.key === "Enter" && handleSearch(query);
                }}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent ref={popoverRef} className="w-96 p-2" onOpenAutoFocus={(e) => e.preventDefault()}>
            {loading && <div className="px-4 py-2">Loading...</div>}
            {!loading && results.length === 0 && <div className="px-4 py-2">No results found.</div>}
            {!loading && results.length > 0 && (
              <div className="flex flex-col gap-2">
                {results.map((entry: any, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-muted rounded-md"
                    onClick={() => {
                      console.log("queryb4", query);
                      router.push(`search?query=${encodeURIComponent(entry.placePrediction.text.text)}`);
                      setPopoverOpen(false);
                    }}
                  >
                    <span>{entry.placePrediction.text.text}</span>
                  </div>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
        <div>
          <Button type="submit" disabled={loading} size="default">
            <div className="flex items-center justify-center w-[50px]">
              {loading ? <ReloadIcon className="h-5 w-5 animate-spin" /> : "Search"}
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}
