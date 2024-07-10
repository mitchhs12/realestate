"use client";

import React, { createContext, useState, ReactNode } from "react";
import { CoordinatesType } from "@/lib/validations";

interface QueryContextProps {
  query: string;
  setQuery: (value: string) => void;
  mapFocused: boolean;
  setMapFocused: (value: boolean) => void;
  coordinates: CoordinatesType;
  setCoordinates: (value: CoordinatesType) => void;
}

const QueryContext = createContext<QueryContextProps>({
  query: "",
  setQuery: () => {},
  mapFocused: false,
  setMapFocused: () => {},
  coordinates: { lat: 0, long: 0 },
  setCoordinates: () => {},
});

interface QueryProviderProps {
  children: ReactNode;
}

const QueryContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [query, setQuery] = useState("");
  const [mapFocused, setMapFocused] = useState(false);
  const [coordinates, setCoordinates] = useState<CoordinatesType>({ lat: 0, long: 0 });

  return (
    <QueryContext.Provider value={{ query, setQuery, mapFocused, setMapFocused, coordinates, setCoordinates }}>
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider };
