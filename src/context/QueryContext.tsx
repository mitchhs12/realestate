"use client";

import React, { createContext, useState, ReactNode } from "react";

interface QueryContextProps {
  query: string;
  setQuery: (value: string) => void;
}

const QueryContext = createContext<QueryContextProps>({ query: "", setQuery: () => {} });

interface QueryProviderProps {
  children: ReactNode;
}

const QueryContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [query, setQuery] = useState("");

  return <QueryContext.Provider value={{ query, setQuery }}>{children}</QueryContext.Provider>;
};

export { QueryContext, QueryContextProvider };
