"use client";

import React, { createContext, useState, ReactNode } from "react";
import { CoordinatesType } from "@/lib/validations";

interface QueryContextProps {
  query: string;
  setQuery: (value: string) => void;
  mapFocused: boolean;
  setMapFocused: (value: boolean) => void;
  newZoom: number;
  setNewZoom: (value: number) => void;
  currentCoords: CoordinatesType | null;
  setCurrentCoords: (value: CoordinatesType | null) => void;
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
});

interface QueryProviderProps {
  children: ReactNode;
}

const QueryContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [query, setQuery] = useState("");
  const [mapFocused, setMapFocused] = useState(false);
  const [newZoom, setNewZoom] = useState(16);
  const [currentCoords, setCurrentCoords] = useState<CoordinatesType | null>(null);

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
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider };
