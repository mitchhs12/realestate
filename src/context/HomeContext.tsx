"use client";

import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { HomeType } from "@/lib/validations";
import { LocaleContext } from "@/context/LocaleContext";
import { languagesRequiringClientSideTranslation } from "@/lib/validations";
import lookup from "country-code-lookup";
import { getCountryNameForLocale } from "@/lib/utils";

interface HomeContextProps {
  home: HomeType;
  matchingTypes: { id: string; translation: string }[];
  matchingFeatures: { id: string; translation: string }[];
  translatedMunicipality: string | null;
  setTranslatedMunicipality: (value: string | null) => void;
  translatedDescription: string | null;
  setTranslatedDescription: (value: string | null) => void;
  translatedTitle: string | null;
  setTranslatedTitle: (value: string | null) => void;
  translationLoading: boolean;
  setTranslationLoading: (value: boolean) => void;
  descriptionLoading: boolean;
  titleLoading: boolean;
  handleDescriptionConvert: () => void;
  handleTitleConvert: () => void;
  description: string | null;
  title: string | null;
  originalDescription: boolean;
  originalTitle: boolean;
  countryName: string | null | undefined;
}

const HomeContext = createContext<HomeContextProps>({
  home: {
    id: 0,
    ownerId: "",
    title: "",
    description: "",
    address: "",
    municipality: "",
    subRegion: "",
    region: "",
    country: "",
    latitude: 0,
    longitude: 0,
    type: [],
    features: [],
    bedrooms: 0,
    bathrooms: 0,
    livingrooms: 0,
    kitchens: 0,
    capacity: 0,
    photos: [],
    price: 0,
    currency: "",
    language: "",
    priceUsd: 0,
    priceNegotiable: false,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    listingType: "",
    areaSqm: 0,
    isActive: false,
    isComplete: false,
    listingFlowStep: 0,
  },
  matchingTypes: [],
  matchingFeatures: [],
  translatedMunicipality: null,
  setTranslatedMunicipality: () => {},
  translatedDescription: null,
  setTranslatedDescription: () => {},
  translatedTitle: null,
  setTranslatedTitle: () => {},
  translationLoading: true,
  setTranslationLoading: () => {},
  descriptionLoading: false,
  titleLoading: false,
  handleDescriptionConvert: () => {},
  handleTitleConvert: () => {},
  description: null,
  title: null,
  originalDescription: true,
  originalTitle: true,
  countryName: "",
});

interface HomeProviderProps {
  children: ReactNode;
  home: HomeType;
  matchingTypes: { id: string; name: string; translation: string }[];
  matchingFeatures: { id: string; name: string; translation: string }[];
}

const HomeContextProvider: React.FC<HomeProviderProps> = ({ children, home, matchingTypes, matchingFeatures }) => {
  const [translatedMunicipality, setTranslatedMunicipality] = useState<string | null>(null);
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translationLoading, setTranslationLoading] = useState<boolean>(false);
  const { defaultLanguage } = useContext(LocaleContext);
  const [descriptionLoading, setDescriptionLoading] = useState<boolean>(false);
  const [titleLoading, setTitleLoading] = useState<boolean>(false);
  const [originalDescription, setOriginalDescription] = useState<boolean>(true);
  const [originalTitle, setOriginalTitle] = useState<boolean>(true);
  const [description, setDescription] = useState<string | null>(home.description);
  const [title, setTitle] = useState<string | null>(home.title);

  const iso = home && home.country && lookup.byIso(home.country);
  const countryName =
    iso && typeof iso !== "string"
      ? getCountryNameForLocale(iso.iso2, defaultLanguage || home.country || "")
      : home.country;

  // Description functions
  const handleDescriptionConvert = () => {
    if (!translatedDescription) {
      home.description && handleTranslate(home.description, false);
    } else {
      setOriginalDescription(!originalDescription);
    }
  };

  useEffect(() => {
    translatedDescription !== home.description && setDescription(translatedDescription);
    setOriginalDescription(false);
  }, [translatedDescription]);

  useEffect(() => {
    originalDescription ? setDescription(home.description) : setDescription(translatedDescription);
  }, [originalDescription]);

  // Title functions
  const handleTitleConvert = () => {
    if (!translatedTitle) {
      home.title && handleTranslate(home.title, true);
    } else {
      setOriginalTitle(!originalTitle);
    }
  };

  useEffect(() => {
    translatedTitle !== home.title && setTitle(translatedTitle);
    setOriginalTitle(false);
  }, [translatedTitle]);

  useEffect(() => {
    originalTitle ? setTitle(home.title) : setTitle(translatedTitle);
  }, [originalTitle]);

  // Helper Function
  const handleTranslate = async (text: string, isTitle: boolean) => {
    isTitle ? setTitleLoading(true) : setDescriptionLoading(true);
    const response = await fetch("/api/translateSpecific", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        target: defaultLanguage,
      }),
    });
    const responseData = await response.json();
    if (responseData.error) {
      console.log("Error translating text:", responseData.error);
      return;
    }
    isTitle ? setTranslatedTitle(responseData.text) : setTranslatedDescription(responseData.text);
    isTitle ? setTitleLoading(false) : setDescriptionLoading(false);
  };

  // Initialization useEffect (runs only if the locale is one of the languages that immediately require client-side translation)
  useEffect(() => {
    const fetchTranslatedData = async () => {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: home.title,
          municipality: home.municipality,
          description: home.description,
          target: defaultLanguage,
        }),
      });
      const responseData = await response.json();
      setTranslatedTitle(responseData.title);
      setTranslatedMunicipality(responseData.municipality);
      setTranslatedDescription(responseData.description);
      setTranslationLoading(false);
    };
    if (
      home &&
      home.municipality &&
      home.description &&
      languagesRequiringClientSideTranslation.includes(defaultLanguage)
    ) {
      fetchTranslatedData();
      setTranslationLoading(true);
    } else {
      setOriginalDescription(true);
      setOriginalTitle(true);
    }
  }, [home]);

  return (
    <HomeContext.Provider
      value={{
        home,
        matchingTypes,
        matchingFeatures,
        translatedMunicipality,
        setTranslatedMunicipality,
        translatedDescription,
        setTranslatedDescription,
        translatedTitle,
        setTranslatedTitle,
        translationLoading,
        setTranslationLoading,
        descriptionLoading,
        titleLoading,
        handleDescriptionConvert,
        handleTitleConvert,
        description,
        title,
        originalDescription,
        originalTitle,
        countryName,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export { HomeContext, HomeContextProvider };
