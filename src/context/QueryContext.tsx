"use client";

import React, { createContext, useState, ReactNode } from "react";
import { CoordinatesType } from "@/lib/validations";

interface QueryContextProps {
  query: string;
  setQuery: (value: string) => void;
  mapFocused: boolean;
  setMapFocused: (value: boolean) => void;
}

const QueryContext = createContext<QueryContextProps>({
  query: "",
  setQuery: () => {},
  mapFocused: false,
  setMapFocused: () => {},
});

interface QueryProviderProps {
  children: ReactNode;
}

const QueryContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [query, setQuery] = useState("");
  const [mapFocused, setMapFocused] = useState(false);

  return (
    <QueryContext.Provider value={{ query, setQuery, mapFocused, setMapFocused }}>{children}</QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider };
