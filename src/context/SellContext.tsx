"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  canSubmit: boolean;
  setCanSubmit: (value: boolean) => void;
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
  canSubmit: false,
  setCanSubmit: () => {},
});

interface QueryProviderProps {
  children: ReactNode;
}

const SellContextProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [prevStep, setPrevStep] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [sellFlowFlatIndex, setSellFlowFlatIndex] = useState(-1);
  const [sellFlowIndices, setSellFlowIndices] = useState({ outerIndex: -1, innerIndex: -1 });
  const [stepPercentage, setStepPercentage] = useState(() => Array(sellSteps.length).fill(0));
  const [currentHome, setCurrentHome] = useState<HomeType | null>(null);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  useEffect(() => {
    console.log("sellFlowFlatIndex", sellFlowFlatIndex);
    console.log(sellFlowIndices);
    console.log("current step", stepsFlattened[sellFlowFlatIndex]);
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
        currentHome,
        setCurrentHome,
        canSubmit,
        setCanSubmit,
      }}
    >
      {children}
    </SellContext.Provider>
  );
};

export { SellContext, SellContextProvider };
