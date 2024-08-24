"use client";

import React, { createContext, useState, ReactNode, useEffect, useRef } from "react";
import { CoordinatesType } from "@/lib/validations";
import { usePathname } from "next/navigation";

interface QueryContextProps {
  query: string;
  setQuery: (value: string) => void;
  mapFocused: boolean;
  setMapFocused: (value: boolean) => void;
  currentCoords: CoordinatesType | null;
  setCurrentCoords: (value: CoordinatesType | null) => void;
  clickedLocation: boolean;
  setClickedLocation: (value: boolean) => void;
}

const QueryContext = createContext<QueryContextProps>({
  query: "",
  setQuery: () => {},
  mapFocused: false,
  setMapFocused: () => {},
  currentCoords: null,
  setCurrentCoords: () => {},
  clickedLocation: false,
  setClickedLocation: () => {},
});

interface QueryProviderProps {
  children: ReactNode;
}

const QueryContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [query, setQuery] = useState("");
  const [mapFocused, setMapFocused] = useState(true);
  const [currentCoords, setCurrentCoords] = useState<CoordinatesType | null>(null);
  const [clickedLocation, setClickedLocation] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setQuery("");
    }
  }, [pathname]);

  return (
    <QueryContext.Provider
      value={{
        query,
        setQuery,
        mapFocused,
        setMapFocused,
        currentCoords,
        setCurrentCoords,
        clickedLocation,
        setClickedLocation,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider };
