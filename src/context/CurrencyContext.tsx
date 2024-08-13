"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { getCurrencies } from "@/app/sell/actions";
import { CurrencyType } from "@/lib/validations";
import { currencyOptions } from "@/lib/validations";
import { useSession } from "next-auth/react";

interface CurrencyContextProps {
  currencies: CurrencyType[];
  setCurrencies: (value: CurrencyType[]) => void;
  defaultCurrency: string;
  setDefaultCurrency: (value: string) => void;
}

const CurrencyContext = createContext<CurrencyContextProps>({
  currencies: [],
  setCurrencies: () => {},
  defaultCurrency: "",
  setDefaultCurrency: () => {},
});

interface CurrencyProviderProps {
  children: ReactNode;
}

const CurrencyContextProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const session = useSession();
  const [currencies, setCurrencies] = useState<CurrencyType[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState<string>("USD");

  useEffect(() => {
    const userLocale = navigator.language || navigator.languages[0];
    const matchedCurrency = currencyOptions.find((option) => option.locale === userLocale)?.currency;

    setDefaultCurrency(session.data?.user.currency || matchedCurrency || "USD");
  }, [session.data]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setCurrencies([]);
      }
    };
    fetchCurrencies();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        setCurrencies,
        defaultCurrency,
        setDefaultCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext, CurrencyContextProvider };
