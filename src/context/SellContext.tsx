"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { sellSteps, stepsFlattened } from "@/lib/sellFlowData";
import { HomeType } from "@/lib/validations";
import { getUnfinishedHome } from "@/app/sell/actions";

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
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
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
  isLoading: false,
  setIsLoading: () => {},
});

interface SellProviderProps {
  children: ReactNode;
  unfinishedHome: HomeType | null;
}

const SellContextProvider: React.FC<SellProviderProps> = ({ children, unfinishedHome }) => {
  const [prevStep, setPrevStep] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [sellFlowFlatIndex, setSellFlowFlatIndex] = useState(-1);
  const [sellFlowIndices, setSellFlowIndices] = useState({ outerIndex: -1, innerIndex: -1 });
  const [stepPercentage, setStepPercentage] = useState(() => Array(sellSteps.length).fill(0));
  const [currentHome, setCurrentHome] = useState<HomeType | null>(unfinishedHome);
  const [newHome, setNewHome] = useState<HomeType | null>(unfinishedHome);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNextStep(
      sellFlowFlatIndex !== -1
        ? sellFlowFlatIndex === stepsFlattened.length - 1
          ? "/"
          : stepsFlattened[sellFlowFlatIndex + 1]
        : stepsFlattened[0]
    );
    setPrevStep(
      sellFlowFlatIndex !== -1
        ? sellFlowIndices.outerIndex === 0 && sellFlowIndices.innerIndex === 0
          ? "/sell"
          : stepsFlattened[sellFlowFlatIndex - 1]
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
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </SellContext.Provider>
  );
};

export { SellContext, SellContextProvider };
