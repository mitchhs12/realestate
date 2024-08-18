"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { CurrencyType, LanguageType } from "@/lib/validations";
import { useSession } from "next-auth/react";
import { getCurrency } from "@/lib/utils";

interface LocaleContextProps {
  defaultCurrency: CurrencyType;
  setDefaultCurrency: (value: CurrencyType) => void;
  defaultLanguage: LanguageType;
  currencies: CurrencyType[];
}

const LocaleContext = createContext<LocaleContextProps>({
  defaultCurrency: { symbol: "USD", usdPrice: 1 },
  setDefaultCurrency: () => {},
  defaultLanguage: "en",
  currencies: [],
});

interface LocaleProviderProps {
  children: ReactNode;
  currencies: CurrencyType[];
  lang: LanguageType;
  currency: CurrencyType;
}

const LocaleContextProvider: React.FC<LocaleProviderProps> = ({
  children,
  currencies,
  lang,
  currency,
}: LocaleProviderProps) => {
  const session = useSession();

  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyType>(currency);
  const defaultLanguage = lang || "en";

  useEffect(() => {
    // useEffect that runs when the user has successfully authenticated and changes the default currency and language if it exists
    console.log("running use effect");
    if (session.data?.user.currency || session.data?.user.language) {
      if (session.data?.user.currency && session.data?.user.currency !== defaultCurrency.symbol) {
        setDefaultCurrency(getCurrency(currencies, session.data?.user.currency));
      }
      // if (session.data?.user.language && session.data?.user.language !== lang) {
      //   console.log("changing locale! because" + session.data?.user.language + " is not equal to " + lang);
      //   changeLocale(session.data?.user.language || lang || "en");
      // }
    }
  }, [session.data]);

  return (
    <LocaleContext.Provider
      value={{
        defaultCurrency,
        setDefaultCurrency,
        defaultLanguage,
        currencies,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export { LocaleContext, LocaleContextProvider };
