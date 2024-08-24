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
  openSignUpModal: () => void;
  openLogInModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (value: boolean) => void;
  revealPrice: boolean;
  setRevealPrice: (value: boolean) => void;
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
  openSignUpModal: () => {},
  openLogInModal: () => {},
  closeModal: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
  isLoginOpen: false,
  setIsLoginOpen: () => {},
  revealPrice: false,
  setRevealPrice: () => {},
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [revealPrice, setRevealPrice] = useState(false);

  const pathname = usePathname();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsLoginOpen(false);
    setIsModalOpen(true);
  };

  const openLogInModal = () => {
    setIsLoginOpen(true);
    setIsModalOpen(true);
  };

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
        openSignUpModal,
        openLogInModal,
        closeModal,
        isModalOpen,
        setIsModalOpen,
        isLoginOpen,
        setIsLoginOpen,
        revealPrice,
        setRevealPrice,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider };
