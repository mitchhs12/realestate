"use client";

import React, { createContext, useState, ReactNode, useEffect, useRef } from "react";
import { CoordinatesType } from "@/lib/validations";
import { usePathname } from "next/navigation";

interface QueryContextProps {
  query: string;
  setQuery: (value: string) => void;
  mapFocused: boolean;
  setMapFocused: (value: boolean) => void;
  newZoom: number;
  setNewZoom: (value: number) => void;
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
  newZoom: 16,
  setNewZoom: () => {},
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
  const [mapFocused, setMapFocused] = useState(false);
  const [newZoom, setNewZoom] = useState(16);
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
        newZoom,
        setNewZoom,
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
