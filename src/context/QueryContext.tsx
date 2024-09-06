"use client";

import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import { defaultCurrency, HomeType } from "@/lib/validations";
import { UpdateSession, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { User } from "next-auth";
import { types, features, typesMap, featuresMap, rooms } from "@/lib/sellFlowData";
import { LocaleContext } from "@/context/LocaleContext";

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
  revealContact: boolean;
  setRevealContact: (value: boolean) => void;
  user?: User;
  session: {
    update: UpdateSession;
    data: Session | null;
    status: "authenticated" | "unauthenticated" | "loading";
  };
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedTypes: string[];
  setSelectedFeatures: (value: string[]) => void;
  selectedFeatures: string[];
  setSelectedTypes: (value: string[]) => void;
  selectedRooms: {
    bedrooms: number[];
    bathrooms: number[];
    livingrooms: number[];
    kitchens: number[];
    maxRooms: number;
  };
  setSelectedRooms: (value: {
    bedrooms: number[];
    bathrooms: number[];
    livingrooms: number[];
    kitchens: number[];
    maxRooms: number;
  }) => void;
  isFiltering: boolean;
  setIsFiltering: (value: boolean) => void;
  allSelectedFeatures: boolean;
  allSelectedTypes: boolean;
  handleAllFeatures: () => void;
  handleAllTypes: () => void;
  newFilters: string;
  setNewFilters: (value: string) => void;
  convertedPriceRange: number[];
  setConvertedPriceRange: (value: number[]) => void;
  initialMaxPrice: number;
  initialMaxRooms: number;
  originalFilters: string;
  lockModal: () => void;
  headerValues: any;
}

const initialMaxPrice = 10000000;
const initialMaxCapacity = 100;
const initialMaxSize = 100000;
const initialMaxRooms = 30;
const originalFilters = JSON.stringify({
  convertedPriceRange: [],
  types: [],
  features: [],
  rooms: {
    bedrooms: [0, initialMaxRooms],
    bathrooms: [0, initialMaxRooms],
    livingrooms: [0, initialMaxRooms],
    kitchens: [0, initialMaxRooms],
    maxRooms: initialMaxRooms,
  },
});

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
  revealContact: false,
  setRevealContact: () => {},
  user: undefined,
  session: {
    update: async () => null,
    data: null,
    status: "loading",
  },
  priceRange: [1, initialMaxPrice],
  setPriceRange: () => {},
  selectedTypes: [],
  setSelectedFeatures: () => {},
  selectedFeatures: [],
  setSelectedTypes: () => {},
  selectedRooms: {
    bedrooms: [0, initialMaxRooms],
    bathrooms: [0, initialMaxRooms],
    livingrooms: [0, initialMaxRooms],
    kitchens: [0, initialMaxRooms],
    maxRooms: initialMaxRooms,
  },
  setSelectedRooms: () => {},
  isFiltering: false,
  setIsFiltering: () => {},
  allSelectedFeatures: true,
  allSelectedTypes: true,
  handleAllFeatures: () => {},
  handleAllTypes: () => {},
  newFilters: JSON.stringify({
    convertedPriceRange: [],
    types: [],
    features: [],
    rooms: {
      bedrooms: [0, initialMaxRooms],
      bathrooms: [0, initialMaxRooms],
      livingrooms: [0, initialMaxRooms],
      kitchens: [0, initialMaxRooms],
      maxRooms: initialMaxRooms,
    },
  }),
  setNewFilters: () => {},
  convertedPriceRange: [1, initialMaxPrice],
  setConvertedPriceRange: () => {},
  initialMaxPrice: initialMaxPrice,
  initialMaxRooms: initialMaxRooms,
  originalFilters: originalFilters,
  lockModal: () => {},
  headerValues: {},
});

interface QueryProviderProps {
  children: ReactNode;
  headerValues: any;
}

interface SelectedRooms {
  bedrooms: number[];
  bathrooms: number[];
  livingrooms: number[];
  kitchens: number[];
  maxRooms: number;
}

const QueryContextProvider: React.FC<QueryProviderProps> = ({ children, headerValues }) => {
  const [query, setQuery] = useState("");
  const [mapFocused, setMapFocused] = useState(true);
  const [clickedLocation, setClickedLocation] = useState<boolean>(false);
  const [currentHome, setCurrentHome] = useState<HomeType | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [revealPrice, setRevealPrice] = useState(false);
  const [revealContact, setRevealContact] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([1, initialMaxPrice]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<SelectedRooms>({
    bedrooms: [0, initialMaxRooms],
    bathrooms: [0, initialMaxRooms],
    livingrooms: [0, initialMaxRooms],
    kitchens: [0, initialMaxRooms],
    maxRooms: initialMaxRooms,
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [allSelectedFeatures, setAllSelectedFeatures] = useState(true);
  const [allSelectedTypes, setAllSelectedTypes] = useState(true);
  const [newFilters, setNewFilters] = useState(
    JSON.stringify({
      convertedPriceRange: [],
      types: [],
      features: [],
      rooms: {
        bedrooms: [0, initialMaxRooms],
        bathrooms: [0, initialMaxRooms],
        livingrooms: [0, initialMaxRooms],
        kitchens: [0, initialMaxRooms],
        maxRooms: initialMaxRooms,
      },
    })
  );
  const [convertedPriceRange, setConvertedPriceRange] = useState<number[]>([]);
  const [isModalLocked, setIsModalLocked] = useState(false);

  const handleAllFeatures = () => {
    if (allSelectedFeatures) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(features);
    }
  };

  const handleAllTypes = () => {
    if (allSelectedTypes) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(types);
    }
  };

  useEffect(() => {
    if (selectedFeatures.length === features.length) {
      setAllSelectedFeatures(true);
    } else {
      setAllSelectedFeatures(false);
    }
  }, [selectedFeatures]);

  useEffect(() => {
    if (selectedTypes.length === types.length) {
      setAllSelectedTypes(true);
    } else {
      setAllSelectedTypes(false);
    }
  }, [selectedTypes]);

  const session = useSession();
  const user = session.data?.user;
  const pathname = usePathname();

  const closeModal = () => {
    if (!isModalLocked) {
      setIsModalOpen(false);
    }
  };

  const lockModal = () => {
    setIsModalLocked(true);
    openLogInModal();
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
        revealContact,
        setRevealContact,
        user,
        session,
        priceRange,
        setPriceRange,
        selectedTypes,
        setSelectedFeatures,
        selectedFeatures,
        setSelectedTypes,
        selectedRooms,
        setSelectedRooms,
        isFiltering,
        setIsFiltering,
        allSelectedFeatures,
        allSelectedTypes,
        handleAllFeatures,
        handleAllTypes,
        newFilters,
        setNewFilters,
        convertedPriceRange,
        setConvertedPriceRange,
        initialMaxPrice,
        initialMaxRooms,
        originalFilters,
        lockModal,
        headerValues,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext, QueryContextProvider };
