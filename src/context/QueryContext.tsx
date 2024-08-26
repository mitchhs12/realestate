"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HomeType } from "@/lib/validations";
import { UpdateSession, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { User } from "next-auth";

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
  user?: User;
  session: {
    update: UpdateSession;
    data: Session | null;
    status: "authenticated" | "unauthenticated" | "loading";
  };
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
  user: undefined,
  session: {
    update: async () => null,
    data: null,
    status: "loading",
  },
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

  const session = useSession();
  const user = session.data?.user;
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
        user,
        session,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider };
