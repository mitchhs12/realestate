"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { sellSteps, stepsFlattened } from "@/lib/sellFlowData";
import { HomeType } from "@/lib/validations";

interface SellContextProps {
  nextStep: string;
  setNextStep: (value: string) => void;
  prevStep: string;
  setPrevStep: (value: string) => void;
  sellFlowIndices: object;
  setSellFlowIndices: (value: { outerIndex: number; innerIndex: number }) => void;
  sellFlowFlatIndex: number;
  setSellFlowFlatIndex: (value: number) => void;
  stepPercentage: number[];
  setStepPercentage: (value: number[]) => void;
  currentHome: HomeType | null;
  setCurrentHome: (value: HomeType | null) => void;
  newHome: HomeType | null;
  setNewHome: (value: HomeType | null) => void;
  nextLoading: boolean;
  setNextLoading: (value: boolean) => void;
  prevLoading: boolean;
  setPrevLoading: (value: boolean) => void;
  nextDisabled: boolean;
  setNextDisabled: (value: boolean) => void;
  isMyPhone: boolean;
  setIsMyPhone: (value: boolean) => void;
}

const SellContext = createContext<SellContextProps>({
  nextStep: "",
  setNextStep: () => {},
  prevStep: "",
  setPrevStep: () => {},
  sellFlowIndices: { outerIndex: 0, innerIndex: 0 },
  setSellFlowIndices: () => {},
  sellFlowFlatIndex: 0,
  setSellFlowFlatIndex: () => {},
  stepPercentage: [],
  setStepPercentage: () => {},
  currentHome: null,
  setCurrentHome: () => {},
  newHome: null,
  setNewHome: () => {},
  nextLoading: false,
  setNextLoading: () => {},
  prevLoading: false,
  setPrevLoading: () => {},
  nextDisabled: false,
  setNextDisabled: () => {},
  isMyPhone: false,
  setIsMyPhone: () => {},
});

interface SellProviderProps {
  children: ReactNode;
}

const SellContextProvider: React.FC<SellProviderProps> = ({ children }) => {
  const [prevStep, setPrevStep] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [sellFlowFlatIndex, setSellFlowFlatIndex] = useState(-1);
  const [sellFlowIndices, setSellFlowIndices] = useState({ outerIndex: -1, innerIndex: -1 });
  const [stepPercentage, setStepPercentage] = useState(() => Array(sellSteps.length).fill(0));
  const [currentHome, setCurrentHome] = useState<HomeType | null>(null);
  const [newHome, setNewHome] = useState<HomeType | null>(null);
  const [nextLoading, setNextLoading] = useState(false);
  const [prevLoading, setPrevLoading] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [isMyPhone, setIsMyPhone] = useState(false);

  useEffect(() => {
    setNextStep(
      sellFlowFlatIndex !== -1
        ? sellFlowFlatIndex === stepsFlattened.length - 1
          ? "/"
          : `/sell/${currentHome?.id}/${stepsFlattened[sellFlowFlatIndex + 1]}`
        : `/sell/${currentHome?.id}/${stepsFlattened[0]}`
    );
    setPrevStep(
      sellFlowFlatIndex !== -1
        ? sellFlowIndices.outerIndex === 0 && sellFlowIndices.innerIndex === 0
          ? `/sell/${currentHome?.id}`
          : `/sell/${currentHome?.id}/${stepsFlattened[sellFlowFlatIndex - 1]}`
        : ""
    );
  }, [sellFlowFlatIndex]);

  return (
    <SellContext.Provider
      value={{
        nextStep,
        setNextStep,
        prevStep,
        setPrevStep,
        sellFlowIndices,
        setSellFlowIndices,
        sellFlowFlatIndex,
        setSellFlowFlatIndex,
        stepPercentage,
        setStepPercentage,
        currentHome,
        setCurrentHome,
        newHome,
        setNewHome,
        nextLoading,
        setNextLoading,
        prevLoading,
        setPrevLoading,
        nextDisabled,
        setNextDisabled,
        isMyPhone,
        setIsMyPhone,
      }}
    >
      {children}
    </SellContext.Provider>
  );
};

export { SellContext, SellContextProvider };
