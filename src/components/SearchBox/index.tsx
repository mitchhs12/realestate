"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect, useContext } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ReloadIcon } from "@radix-ui/react-icons";
import { QueryContext } from "@/context/QueryContext";

interface Result {
  Text: string;
  PlaceId: string;
}

interface Props {
  isSmallMap: boolean;
  setSearchResult?: (text: string, placeId: string) => void;
}

export default function SearchBox({ isSmallMap = false, setSearchResult }: Props) {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false); // State to control Popover open
  const { query, setQuery, clickedLocation, setClickedLocation } = useContext(QueryContext);
  const initialQueryRef = useRef(query);
  const [longLatArray, setLongLatArray] = useState<number[]>([]); // State for longLatArray
  const isNavigating = useRef(false); // Flag to track if navigation is occurring
  const pathname = usePathname();

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongLatArray([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = (text: string, placeId: string) => {
    if (placeId && !isSmallMap) {
      isNavigating.current = true;
      router.push(`/search/${placeId}`);
    } else {
      setSearchResult!(text, placeId);
    }
    setQuery(text);
    setPopoverOpen(false);
  };

  useEffect(() => {
    if (query === initialQueryRef.current) return;

    if (query && !isNavigating.current) {
      setLoading(true);
      fetchPlaces(query);
    } else {
      setPopoverOpen(false); // Close Popover if query is empty
    }
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

  const fetchPlaces = async (query: string) => {
    try {
      const body =
        longLatArray.length > 0 ? { query: { text: query, longLatArray: longLatArray } } : { query: { text: query } };
      const response = await fetch("/api/autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const results = await response.json();
      if (results.suggestions) {
        setResults(results.suggestions);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (clickedLocation) {
      setClickedLocation(false);
      handleSearch(results[0].Text, results[0].PlaceId);
      return;
    }
    if (results.length > 0 && !loading && !isNavigating.current) {
      setPopoverOpen(true);
    }
  }, [results]);

  // Reset isNavigating on component mount
  useEffect(() => {
    isNavigating.current = false;
  }, [pathname]);

  return (
    <div className="flex w-full">
      <form
        className="flex w-full justify-center space-x-2 px-4"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("test");
          {
            results.length > 0 && handleSearch(results[0].Text, results[0].PlaceId);
          }
        }}
      >
        <div className="flex flex-col w-full items-center">
          <Popover open={popoverOpen}>
            <div className="flex justify-center items-center w-[286px] sm:w-[400px] md:w-[540px] lg:w-[800px] xl:w-[1000px] gap-x-2">
              <PopoverTrigger asChild>
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder={"Search for any address or place..."}
                  className="z-100 bg-popover"
                  value={query}
                  onFocus={getGeolocation}
                  onMouseDown={() => results.length > 0 && query && setPopoverOpen(true)} // Open Popover on mouse down if there are results
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (!loading && e.key === "Enter") {
                      e.preventDefault();
                      results.length > 0 && handleSearch(results[0].Text, results[0].PlaceId);
                    }
                  }}
                />
              </PopoverTrigger>
              <Button variant="default" type="submit" disabled={loading} size="default" className="hidden lg:flex">
                <div className="hidden sm:flex items-center justify-center w-[50px]">
                  {loading ? <ReloadIcon className="h-5 w-5 animate-spin" /> : "Search"}
                </div>
              </Button>
            </div>
            {(!loading || results.length > 0) && (
              <div className="flex w-full">
                <PopoverContent
                  ref={popoverRef}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className="w-[286px] sm:w-[400px] md:w-[540px] lg:w-[710px] xl:w-[910px]"
                >
                  {results.length === 0 && <div>No results found.</div>}
                  {results.length > 0 && (
                    <div className="w-full h-full">
                      {results.map((entry: any, index) => (
                        <div
                          key={index}
                          className="py-2 cursor-pointer hover:bg-muted rounded-md"
                          onClick={() => {
                            handleSearch(entry.Text, entry.PlaceId);
                          }}
                        >
                          <span className="block truncate">{entry.Text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </div>
            )}
          </Popover>
        </div>
      </form>
    </div>
  );
}
