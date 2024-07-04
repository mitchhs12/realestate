"use client";

import React, { createContext, useState, ReactNode } from "react";

interface QueryContextProps {
  query: string;
  updateQuery: (value: string) => void;
}

const QueryContext = createContext<QueryContextProps>({ query: "", updateQuery: () => {} });

interface QueryProviderProps {
  children: ReactNode;
}

const QueryContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [query, setQuery] = useState("");

  const updateQuery = (newQuery: string) => {
    console.log("updating query", newQuery);
    setQuery(newQuery);
  };

  return <QueryContext.Provider value={{ query, updateQuery }}>{children}</QueryContext.Provider>;
};

export { QueryContext, QueryContextProvider };
