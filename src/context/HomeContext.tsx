"use client";

import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { HomeType } from "@/lib/validations";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { languagesRequiringClientSideTranslation } from "@/lib/validations";
import lookup from "country-code-lookup";
import { findMatching, getCountryNameForLocale } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { saveHome } from "@/app/[locale]/homes/actions";

interface HomeContextProps {
  home: HomeType;
  matchingTypes: { id: string; name: string; translation: string }[];
  currentType: { id: string; name: string; translation: string };
  setCurrentType: (value: { id: string; name: string; translation: string }) => void;
  matchingFeatures: { id: string; name: string; translation: string }[];
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
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  handleSaveEdits: () => void;
  editedHome: HomeType;
  setEditedHome: (value: HomeType) => void;
  saveLoading: boolean;
  homeOwnerName: string;
  homeOwnerEmail: string;
  homeOwnerPhone: string;
  handleGetContactInfo: () => void;
  fetchingContactInfo: boolean;
  billingError: boolean;
  contactInfoError: string | null;
  redirectUrl: string;
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
    exactLocation: false,
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
    completedAt: null,
  },
  matchingTypes: [],
  currentType: { id: "", name: "", translation: "" },
  setCurrentType: () => {},
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
  editMode: false,
  setEditMode: () => {},
  handleSaveEdits: () => {},
  editedHome: {
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
    exactLocation: false,
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
    completedAt: null,
  },
  setEditedHome: () => {},
  saveLoading: false,
  homeOwnerName: "",
  homeOwnerEmail: "",
  homeOwnerPhone: "",
  handleGetContactInfo: () => {},
  fetchingContactInfo: false,
  billingError: false,
  contactInfoError: null,
  redirectUrl: "",
});

interface HomeProviderProps {
  children: ReactNode;
  typesObject: { id: string; name: string; translation: string }[];
  featuresObject: { id: string; name: string; translation: string }[];
  originalHome: any;
  originalMatchingTypes: { id: string; name: string; translation: string }[];
  originalMatchingFeatures: { id: string; name: string; translation: string }[];
}

const HomeContextProvider: React.FC<HomeProviderProps> = ({
  children,
  typesObject,
  featuresObject,
  originalHome,
  originalMatchingTypes,
  originalMatchingFeatures,
}) => {
  const [home, setHome] = useState(originalHome);
  const [matchingTypes, setMatchingTypes] = useState(originalMatchingTypes);
  const [currentType, setCurrentType] = useState(matchingTypes[0]);
  const [matchingFeatures, setMatchingFeatures] = useState(originalMatchingFeatures);
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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [editedHome, setEditedHome] = useState<any>(home);
  const [homeOwnerName, setHomeOwnerName] = useState<string>("Mitchell Spencer");
  const [homeOwnerEmail, setHomeOwnerEmail] = useState<string>("mitchell@vivaideal.com");
  const [haveContactInfo, setHaveContactInfo] = useState<boolean>(false);
  const [homeOwnerPhone, setHomeOwnerPhone] = useState<string>("+51 958 751 401");
  const [fetchingContactInfo, setFetchingContactInfo] = useState<boolean>(false);
  const [billingError, setBillingError] = useState<boolean>(false);
  const [contactInfoError, setContactInfoError] = useState<string | null>(null);
  const pathname = usePathname();
  const { setRevealContact, revealContact } = useContext(QueryContext);

  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${defaultLanguage}${pathname}`
      : `https://www.vivaideal.com/${defaultLanguage}${pathname}`;

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

  const handleGetContactInfo = async () => {
    setFetchingContactInfo(true);
    const response = await fetch("/api/contactData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        homeId: home.id,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      setHomeOwnerName(data.result.contactName);
      setHomeOwnerEmail(data.result.contactEmail);
      setHomeOwnerPhone(data.result.contactPhone);
      setHaveContactInfo(true);
    } else {
      setContactInfoError(data.error);
      if (data.error === "Insufficient credits") {
        setBillingError(true);
      } else if (data.error === "Not subscribed") {
        setBillingError(true);
      }
    }

    setFetchingContactInfo(false);
  };

  useEffect(() => {
    if (haveContactInfo && homeOwnerName && homeOwnerEmail && homeOwnerPhone) {
      console.log("name", homeOwnerName);
      setRevealContact(true);
    }
  }, [haveContactInfo, homeOwnerName, homeOwnerEmail, homeOwnerPhone]);

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

  const handleSaveEdits = async () => {
    setSaveLoading(true);
    const newHome = await saveHome(editedHome, pathname);
    const matchingTypes = findMatching(typesObject, newHome, "type");
    const matchingFeatures = findMatching(featuresObject, newHome, "features");
    setMatchingTypes(matchingTypes);
    setMatchingFeatures(matchingFeatures);
    setCurrentType(matchingTypes[0]);
    setDescription(newHome.description);
    setHome(newHome);
    setSaveLoading(false);
  };

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
        source: home.language,
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
        currentType,
        setCurrentType,
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
        editMode,
        setEditMode,
        handleSaveEdits,
        editedHome,
        setEditedHome,
        saveLoading,
        homeOwnerName,
        homeOwnerEmail,
        homeOwnerPhone,
        handleGetContactInfo,
        fetchingContactInfo,
        billingError,
        contactInfoError,
        redirectUrl,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export { HomeContext, HomeContextProvider };
