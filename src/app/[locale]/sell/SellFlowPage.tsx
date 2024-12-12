"use client";

import { Separator } from "@/components/ui/separator";
import { useEffect, useContext } from "react";
import { SellContext } from "@/context/SellContext";
import { stepsFlattened, stepLengthsWithoutStepPages } from "@/lib/sellFlowData";
import { Checkbox } from "@/components/ui/checkbox";
import { LanguageType } from "@/lib/validations";
import { LocaleContext } from "@/context/LocaleContext";
import { formatNumber } from "@/lib/utils";
import { HomeType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { getNextPeriodCredits } from "@/lib/utils";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  locale: LanguageType;
  title: string;
  titleContinue: string;
  step1: string;
  step1Sub: string;
  step2: string;
  step2Sub: string;
  step3: string;
  step3Sub: string;
  completed: string;
  viewText: string;
  unfinishedHomes?: HomeType[];
  setModalOpen?: (value: boolean) => void;
  propertiesRemaining: {
    sub: string;
    year: string;
    month: string;
  };
}

export default function SellFlowPage({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  titleContinue,
  step1,
  step1Sub,
  step2,
  step2Sub,
  step3,
  step3Sub,
  completed,
  viewText,
  unfinishedHomes,
  setModalOpen,
  propertiesRemaining,
}: Props) {
  const { numerals, user } = useContext(LocaleContext);

  const getTotalSteps = (step1: number, step2: number) => {
    const totalStep = stepsFlattened.length - 3 - step1 - step2;
    const newNum = formatNumber(totalStep, numerals);
    return newNum;
  };

  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setCurrentHome,
    setPrevLoading,
  } = useContext(SellContext);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  const step = currentHome?.listingFlowStep;

  return (
    <div className="flex flex-col relative h-full justify-start md:justify-center items-center gap-y-20 md:gap-y-0 md:flex-row w-full">
      <div className="flex flex-col h-full w-full gap-6 justify-start items-center">
        <div className="flex flex-col md:flex-row w-full h-full justify-start items-center">
          <div className="flex md:w-1/2 items-center md:items-center justify-center py-3 text-center">
            <div className="flex flex-col gap-6 text-center px-10">
              <h1 className="text-2xl xs:text-3xl">{currentHome ? titleContinue : title}</h1>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg xs:text-xl">
                  {propertiesRemaining.sub}: {user?.sellCredits}
                </h3>
                <h4 className="text-sm">
                  {user && user.sellerSubIsYearly ? propertiesRemaining.year : propertiesRemaining.month}:{" "}
                  {user && getNextPeriodCredits(user.sellerSubscription!, user.sellerSubIsYearly!, true)}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex h-full justify-center items-center flex-col md:items-start gap-8 md:gap-20 w-1/2 md:mr-8 text-wrap">
            <div className="flex flex-col gap-y-12 justify-center w-[52vw] md:w-[40vw]">
              <div className="flex flex-col items-start">
                <h3 className="flex items-center justify-between w-full text-xl font-semibold gap-5">
                  {step1}
                  {step && (
                    <label className="hidden lg:flex items-center gap-3 text-sm">
                      {step > stepLengthsWithoutStepPages[0]
                        ? formatNumber(stepLengthsWithoutStepPages[0], numerals)
                        : formatNumber(step, numerals)}
                      /{getTotalSteps(stepLengthsWithoutStepPages[1], stepLengthsWithoutStepPages[2])}
                      <span className="hidden 2xl:flex">{completed}</span>
                      <Checkbox
                        id="state"
                        disabled={true}
                        checked={step > stepLengthsWithoutStepPages[0] ? true : false}
                      />
                    </label>
                  )}
                </h3>
                <div>{step1Sub}</div>
              </div>
              <Separator />
              <div className="flex flex-col items-start">
                <h3 className="flex items-center justify-between w-full text-xl font-semibold gap-5">
                  {step2}
                  {step && (
                    <label className="hidden lg:flex items-center gap-3 text-sm">
                      {formatNumber(
                        Math.min(
                          step - stepLengthsWithoutStepPages[0] - 1 > 0 ? step - stepLengthsWithoutStepPages[0] - 1 : 0,
                          stepLengthsWithoutStepPages[1]
                        ),
                        numerals
                      )}
                      /{getTotalSteps(stepLengthsWithoutStepPages[0], stepLengthsWithoutStepPages[2])}
                      <span className="hidden 2xl:flex">{completed}</span>
                      <Checkbox
                        id="state"
                        disabled={true}
                        checked={
                          step > stepLengthsWithoutStepPages[0] + stepLengthsWithoutStepPages[1] + 1 ? true : false
                        }
                      />
                    </label>
                  )}
                </h3>
                <div>{step2Sub}</div>
              </div>
              <Separator />
              <div className="flex flex-col items-start">
                <h3 className="flex items-center justify-between w-full text-xl font-semibold gap-5">
                  {step3}
                  {step && (
                    <label className="hidden lg:flex text-md items-center gap-3 text-sm">
                      {step - stepLengthsWithoutStepPages[0] - stepLengthsWithoutStepPages[1] - 2 > 0
                        ? formatNumber(
                            step - stepLengthsWithoutStepPages[0] - stepLengthsWithoutStepPages[1] - 2,
                            numerals
                          )
                        : formatNumber(0, numerals)}
                      /{getTotalSteps(stepLengthsWithoutStepPages[0], stepLengthsWithoutStepPages[1])}
                      <span className="hidden 2xl:flex">{completed}</span>
                      <Checkbox
                        id="state"
                        disabled={true}
                        checked={
                          step >
                          stepLengthsWithoutStepPages[0] +
                            stepLengthsWithoutStepPages[1] +
                            stepLengthsWithoutStepPages[2] +
                            2
                            ? true
                            : false
                        }
                      />
                    </label>
                  )}
                </h3>
                <div>{step3Sub}</div>
              </div>
            </div>
          </div>
        </div>
        {unfinishedHomes && unfinishedHomes.length > 0 && (
          <div className="flex flex-col gap-3 items-center pb-10">
            <Button
              onClick={() => {
                setModalOpen && setModalOpen(true);
              }}
            >
              {viewText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
