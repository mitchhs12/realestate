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
import { TypeAnimation } from "react-type-animation";

interface Result {
  Text: string;
  PlaceId: string;
}

interface Props {
  rawBox?: boolean;
  isSmallMap: boolean;
  setSearchResult?: (text: string, placeId: string) => void;
  text: string;
  placeholder: string;
  placeholderShort: string;
}

export default function SearchBox({
  rawBox = false,
  isSmallMap = false,
  setSearchResult,
  text,
  placeholderShort,
}: Props) {
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

  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      console.log("Input is focused!");
    }
  }, []);

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
          {pathname !== "/sell/location" && !rawBox && (
            <div className="flex justify-start items-center">
              <div className="hidden md:flex">
                <Filters />
              </div>
              <div className="flex md:hidden">
                <FiltersDialog />
              </div>
            </div>
          )}
          <Popover open={popoverOpen}>
            <PopoverTrigger asChild>
              <div className="flex justify-center items-center w-full rounded-full">
                <div className="relative w-full flex justify-center items-center">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    autoFocus={false}
                    ref={inputRef}
                    type="search"
                    placeholder={pathname !== "/" && pathname !== `/${defaultLanguage}` ? placeholderShort : ""}
                    className={`${pathname === "/sell/location" ? "rounded-full lg:rounded-l-full lg:rounded-r-none" : rawBox ? "rounded-md" : "rounded-none"} bg-popover pl-11 overflow-hidden whitespace-nowrap text-ellipsis`} // Add padding-left to create space for the icon
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
                  {(!query && pathname === "/") ||
                    (!query && pathname === `/${defaultLanguage}` && (
                      <span className="type absolute left-[2.80rem] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none truncate overflow-hidden whitespace-nowrap text-ellipsis w-full max-w-[calc(100%-4.75rem)]">
                        <TypeAnimation
                          preRenderFirstString={true}
                          cursor={false}
                          sequence={[
                            `${placeholderShort}`,
                            2500,
                            "São Paulo, Brazil",
                            2500,
                            "Mexico City, Mexico",
                            2500,
                            "Buenos Aires, Argentina",
                            2500,
                            "Lima, Peru",
                            2500,
                            "Bogotá, Colombia",
                            2500,
                            "Santiago, Chile",
                            2500,
                            "Rio de Janeiro, Brazil",
                            2500,
                            "Caracas, Venezuela",
                            2500,
                            "Guadalajara, Mexico",
                            2500,
                            "Quito, Ecuador",
                            2500,
                            "Medellín, Colombia",
                            2500,
                            "La Paz, Bolivia",
                            2500,
                            "Panama City, Panama",
                            2500,
                            "Havana, Cuba",
                            2500,
                            "Asunción, Paraguay",
                            2500,
                            "San Salvador, El Salvador",
                            2500,
                            "Montevideo, Uruguay",
                            2500,
                            "San José, Costa Rica",
                            2500,
                            "Santo Domingo, Dominican Republic",
                            2500,
                            "Port-au-Prince, Haiti",
                            2500,
                          ]}
                          repeat={Infinity}
                          wrapper="span"
                          speed={50}
                          deletionSpeed={75}
                        />
                      </span>
                    ))}
                </div>
              </div>
            </PopoverTrigger>

            {(!loading || results.length > 0) && (
              <div>
                <PopoverContent
                  ref={popoverRef}
                  sideOffset={1}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  className={`${pathname.startsWith("/search") ? (rawBox ? "flex" : "hidden sm:flex") : "flex"} flex-col PopoverContent rounded-b-3xl ${pathname === "/sell/location" && "rounded-3xl lg:rounded-r-none lg:rounded-b-3xl"}`}
                >
                  {results.length === 0 && "No results found."}
                  {results.length > 0 &&
                    results.map((entry: any, index) => (
                      <div
                        key={index}
                        className={`${index === 0 ? (results.length === 1 ? (pathname === "/sell/location" ? "rounded-l-2xl" : "rounded-b-2xl") : pathname === "/sell/location" ? "rounded-tl-2xl" : "rounded-b-2xl") : index === results.length - 1 && (pathname === "/sell/location" ? "rounded-bl-2xl" : "rounded-b-2xl")} py-1 md:py-2 cursor-pointer hover:bg-muted`}
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
          {!rawBox && (
            <Button
              variant="default"
              type="submit"
              disabled={loading}
              size="default"
              className={`rounded-r-full pr-5 h-12 flex items-center justify-center border border-primary`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className={`flex justify-center items-center`}>
                  {loading ? <ReloadIcon className="w-5 h-5 animate-spin" /> : <Search size={20} />}
                </span>
                <span className="hidden md:flex">{text}</span>
              </div>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
