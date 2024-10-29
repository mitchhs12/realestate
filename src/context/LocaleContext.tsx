"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { CurrencyType, HomeType, LanguageType, numeralMap } from "@/lib/validations";
import { useSession } from "next-auth/react";
import { getCurrency } from "@/lib/utils";
import { useChangeLocale } from "@/locales/client";
import { User } from "next-auth";

interface LocaleContextProps {
  defaultCurrency: CurrencyType | null;
  setDefaultCurrency: (value: CurrencyType) => void;
  defaultLanguage: LanguageType;
  currencyData: { prices: CurrencyType[]; defaultCurrency: CurrencyType } | null;
  numerals: string;
  setNumerals: (value: string) => void;
  user?: User;
  setUser: (value: any) => void;
  sessionLoading: boolean;
  sessionUnauthenticated: boolean;
}

const LocaleContext = createContext<LocaleContextProps>({
  defaultCurrency: { symbol: "USD", usdPrice: 1, decimalsLimit: 2 },
  setDefaultCurrency: () => {},
  defaultLanguage: "en",
  currencyData: null,
  numerals: "en",
  setNumerals: () => {},
  user: undefined,
  setUser: () => {},
  sessionLoading: true,
  sessionUnauthenticated: true,
});

interface LocaleProviderProps {
  children: ReactNode;
  lang: LanguageType;
}

const LocaleContextProvider: React.FC<LocaleProviderProps> = ({ children, lang }: LocaleProviderProps) => {
  const session = useSession();

  const changeLocale = useChangeLocale();
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyType | null>({
    symbol: "USD",
    usdPrice: 1,
    decimalsLimit: 2,
  });
  const [currencyData, setCurrencyData] = useState<{ prices: CurrencyType[]; defaultCurrency: CurrencyType } | null>(
    null
  );

  const [numerals, setNumerals] = useState<string>(numeralMap[lang]);
  const [user, setUser] = useState<User | undefined>(session.data?.user);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionUnauthenticated, setSessionUnauthenticated] = useState(session.status === "unauthenticated");
  const defaultLanguage = lang;

  useEffect(() => {
    const fetchCurrencies = async () => {
      const response = await fetch("/api/getCurrencyData");
      const data = await response.json();
      setCurrencyData(data);
      setDefaultCurrency(getCurrency(data.prices, data.defaultCurrency));
    };
    fetchCurrencies();
  }, [lang]);

  useEffect(() => {
    if (session.data?.user) {
      setUser(session.data?.user);
      setSessionUnauthenticated(false);
      setSessionLoading(false);
    } else if (session.status === "unauthenticated") {
      setSessionUnauthenticated(true);
      setSessionLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session.data && session.data.user) {
      const userData = session.data.user;
      if (userData.language && userData.language !== lang) {
        changeLocale(userData.language);
      } else if (
        userData.currency &&
        defaultCurrency &&
        defaultCurrency.symbol !== "USD" &&
        currencyData &&
        userData.currency !== currencyData.defaultCurrency.symbol
      ) {
        const newDefaultCurrency = getCurrency(currencyData.prices, userData.currency);
        if (newDefaultCurrency !== defaultCurrency) {
          setDefaultCurrency(newDefaultCurrency);
        }
      }
    }
  }, [session.data, currencyData]);

  return (
    <LocaleContext.Provider
      value={{
        defaultCurrency,
        setDefaultCurrency,
        defaultLanguage,
        currencyData,
        numerals,
        setNumerals,
        user,
        setUser,
        sessionLoading,
        sessionUnauthenticated,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export { LocaleContext, LocaleContextProvider };
