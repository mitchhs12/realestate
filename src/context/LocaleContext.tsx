"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { CurrencyType, LanguageType, numeralMap } from "@/lib/validations";
import { useSession } from "next-auth/react";
import { getCurrency } from "@/lib/utils";
import { useChangeLocale } from "@/locales/client";
import { getCurrencies } from "@/app/[locale]/sell/actions";
import { User } from "next-auth";

interface LocaleContextProps {
  defaultCurrency: CurrencyType;
  setDefaultCurrency: (value: CurrencyType) => void;
  defaultLanguage: LanguageType;
  currencies: CurrencyType[];
  numerals: string;
  setNumerals: (value: string) => void;
  user?: User;
  setUser: (value: User) => void;
  sessionLoading: boolean;
  sessionUnauthenticated: boolean;
}

const LocaleContext = createContext<LocaleContextProps>({
  defaultCurrency: { symbol: "USD", usdPrice: 1 },
  setDefaultCurrency: () => {},
  defaultLanguage: "en",
  currencies: [],
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
  matchedCurrency: string;
}

const LocaleContextProvider: React.FC<LocaleProviderProps> = ({
  children,
  lang,
  matchedCurrency,
}: LocaleProviderProps) => {
  const session = useSession();
  const changeLocale = useChangeLocale();
  const startingCurrency = { symbol: "USD", usdPrice: 1 };
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyType>(startingCurrency);
  const [currencies, setCurrencies] = useState<CurrencyType[]>([startingCurrency]);
  const [numerals, setNumerals] = useState<string>(numeralMap[lang]);
  const [user, setUser] = useState(session.data?.user);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionUnauthenticated, setSessionUnauthenticated] = useState(session.status === "unauthenticated");
  const defaultLanguage = lang || "en";

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
    const _getCurrency = async () => {
      const currencies = await getCurrencies();
      if (currencies) {
        setCurrencies(currencies);
        const currency = getCurrency(currencies, matchedCurrency);
        setDefaultCurrency(currency);
      }
    };
    _getCurrency();
  }, [lang]);

  useEffect(() => {
    // useEffect that runs when the user has successfully authenticated and changes the default currency and language if it exists
    if (session.data?.user.currency || session.data?.user.language) {
      if (session.data?.user.currency && session.data?.user.currency !== defaultCurrency.symbol) {
        setDefaultCurrency(getCurrency(currencies, session.data?.user.currency));
      }
      if (session.data?.user.language && session.data?.user.language !== lang) {
        changeLocale(session.data?.user.language || defaultLanguage);
      }
    }
  }, [session.data]);

  return (
    <LocaleContext.Provider
      value={{
        defaultCurrency,
        setDefaultCurrency,
        defaultLanguage,
        currencies,
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
