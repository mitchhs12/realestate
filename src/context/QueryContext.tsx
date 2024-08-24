"use client";

import React, { createContext, useState, ReactNode, useEffect, useRef } from "react";
import { CoordinatesType } from "@/lib/validations";
import { usePathname } from "next/navigation";
import { HomeType } from "@/lib/validations";

interface QueryContextProps {
  query: string;
  setQuery: (value: string) => void;
  mapFocused: boolean;
  setMapFocused: (value: boolean) => void;
  clickedLocation: boolean;
  setClickedLocation: (value: boolean) => void;
  currentHome: HomeType | null;
  setCurrentHome: (value: HomeType | null) => void;
  isSmallScreen: boolean;
  setIsSmallScreen: (value: boolean) => void;
}

const QueryContext = createContext<QueryContextProps>({
  query: "",
  setQuery: () => {},
  mapFocused: false,
  setMapFocused: () => {},
  clickedLocation: false,
  setClickedLocation: () => {},
  currentHome: null,
  setCurrentHome: () => {},
  isSmallScreen: false,
  setIsSmallScreen: () => {},
});

interface QueryProviderProps {
  children: ReactNode;
}

const QueryContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [query, setQuery] = useState("");
  const [mapFocused, setMapFocused] = useState(true);
  const [clickedLocation, setClickedLocation] = useState<boolean>(false);
  const [currentHome, setCurrentHome] = useState<HomeType | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setQuery("");
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640); // 640px corresponds to the 'sm' breakpoint in Tailwind
    };

    handleResize(); // Set the initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <QueryContext.Provider
      value={{
        query,
        setQuery,
        mapFocused,
        setMapFocused,
        clickedLocation,
        setClickedLocation,
        currentHome,
        setCurrentHome,
        isSmallScreen,
        setIsSmallScreen,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider };
