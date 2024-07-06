"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { sellSteps, stepsFlattened } from "@/lib/sellFlowData";

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
});

interface QueryProviderProps {
  children: ReactNode;
}

const SellContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [prevStep, setPrevStep] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [sellFlowFlatIndex, setSellFlowFlatIndex] = useState(0);
  const [sellFlowIndices, setSellFlowIndices] = useState({ outerIndex: 0, innerIndex: 0 });
  const [stepPercentage, setStepPercentage] = useState(() => Array(sellSteps.length).fill(0));

  useEffect(() => {
    console.log("sellFlowFlatIndex", sellFlowFlatIndex);
    console.log("current step", stepsFlattened[sellFlowFlatIndex]);
    setNextStep(sellFlowFlatIndex ? stepsFlattened[sellFlowFlatIndex + 1] : "/");
    setPrevStep(sellFlowFlatIndex ? stepsFlattened[sellFlowFlatIndex - 1] : "/");
  }, [sellFlowFlatIndex]);

  useEffect(() => {
    console.log(nextStep);
    console.log(prevStep);
  }, [nextStep]);

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
      }}
    >
      {children}
    </SellContext.Provider>
  );
};

export { SellContext, SellContextProvider };
