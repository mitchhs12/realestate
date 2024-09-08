"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect, useContext } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ReloadIcon } from "@radix-ui/react-icons";
import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { Search } from "lucide-react";
import Filters from "@/components/Filters";
import FiltersDialog from "@/components/FiltersDialog";

interface Result {
  Text: string;
  PlaceId: string;
}

interface Props {
  isSmallMap: boolean;
  setSearchResult?: (text: string, placeId: string) => void;
  text: string;
  placeholder: string;
}

export default function SearchBox({ isSmallMap = false, setSearchResult, text, placeholder }: Props) {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false); // State to control Popover open
  const { query, setQuery, clickedLocation, setClickedLocation } = useContext(QueryContext);
  const { defaultLanguage } = useContext(LocaleContext);
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
        longLatArray.length > 0
          ? { query: { text: query, language: defaultLanguage, longLatArray: longLatArray } }
          : { query: { text: query, language: defaultLanguage } };
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
    if (results.length > 0) {
      if (clickedLocation) {
        setClickedLocation(false);
        handleSearch(results[0].Text, results[0].PlaceId);
        return;
      }
      if (!loading && !isNavigating.current) {
        if (results.length !== 1 && query !== results[0].Text) {
          setPopoverOpen(true);
        }
      }
    }
  }, [results]);

  // Reset isNavigating on component mount
  useEffect(() => {
    isNavigating.current = false;
  }, [pathname]);

  return (
    <div className="flex w-full">
      <form
        className="flex w-full justify-center space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (results.length > 0) {
            handleSearch(results[0].Text, results[0].PlaceId);
          }
        }}
      >
        <div className="flex w-full items-center">
          {pathname !== "/sell/location" && (
            <div className="flex justify-start items-center">
              <div className="hidden sm:flex">
                <Filters />
              </div>
              <div className="flex sm:hidden">
                <FiltersDialog />
              </div>
            </div>
          )}
          <Popover open={popoverOpen}>
            <PopoverTrigger asChild>
              <div className="flex justify-center items-center w-full rounded-full">
                <div className="relative w-full justify-center items-center">
                  <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    ref={inputRef}
                    type="search"
                    placeholder={placeholder}
                    className={`${pathname === "/sell/location" ? "rounded-full lg:rounded-l-full lg:rounded-r-none" : "rounded-none"} bg-popover pl-11`} // Add padding-left to create space for the icon
                    value={query}
                    onFocus={getGeolocation}
                    onMouseDown={() => results.length > 0 && query && setPopoverOpen(true)}
                    onChange={(e) => {
                      setQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (!loading && e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        results.length > 0 && handleSearch(results[0].Text, results[0].PlaceId);
                      }
                    }}
                  />
                </div>
              </div>
            </PopoverTrigger>

            {(!loading || results.length > 0) && (
              <div>
                <PopoverContent
                  ref={popoverRef}
                  sideOffset={1}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className={`PopoverContent rounded-b-3xl ${pathname === "/sell/location" && "rounded-3xl lg:rounded-r-none lg:rounded-b-3xl"}`}
                >
                  {results.length === 0 && "No results found."}
                  {results.length > 0 &&
                    results.map((entry: any, index) => (
                      <div
                        key={index}
                        className={`${index === 0 ? (results.length === 1 ? "rounded-b-2xl" : "rounded-b-2xl") : index === results.length - 1 && "rounded-b-2xl"} py-1 md:py-2 cursor-pointer hover:bg-muted`}
                        onClick={() => {
                          handleSearch(entry.Text, entry.PlaceId);
                        }}
                      >
                        <p className="flex gap-x-3 px-2 justify-start items-center">
                          <span>
                            <Search size={16} className="text-gray-400" />
                          </span>
                          <span className="block truncate text-gray-400">{entry.Text}</span>
                        </p>
                      </div>
                    ))}
                </PopoverContent>
              </div>
            )}
          </Popover>
          <Button
            variant="default"
            type="submit"
            disabled={loading}
            size="default"
            className="hidden rounded-r-full h-12 lg:flex items-center justify-center shadow-sm shadow-secondary border border-primary"
          >
            <div className="inline-flex items-center justify-center">
              <span className={`flex items-center gap-2`}>
                {loading ? <ReloadIcon className="w-5 h-5 animate-spin" /> : <Search size={20} />} {text}
              </span>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}
