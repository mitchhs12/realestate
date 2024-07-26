"use client";

import { User } from "next-auth";
import { Separator } from "@/components/ui/separator";
import { useEffect, useContext } from "react";
import { SellContext } from "@/context/SellContext";
import { stepsFlattened, stepLengthsWithoutStepPages, stepLengths } from "@/lib/sellFlowData";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

const getTotalSteps = (step1: number, step2: number) => {
  return stepsFlattened.length - 3 - step1 - step2;
};

export default function SellFlowPage({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, currentHome, setIsLoading } =
    useContext(SellContext);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  const step = currentHome?.listingFlowStep;

  return (
    <div className="flex flex-col h-full justify-start md:justify-center items-center gap-y-20 md:gap-y-0 md:flex-row w-full">
      <div className="flex flex-col md:flex-row w-full h-full justify-start items-center">
        <div className="flex w-1/2 items-center md:items-center justify-center py-3 text-center text-nowrap">
          <h1 className="flex items-center text-3xl">{currentHome ? "Finish your listing" : "Sell your property"}</h1>
        </div>
        <div className="flex h-full justify-center items-center flex-col md:items-start gap-8 md:gap-20 w-1/2 md:mr-8 text-wrap">
          <div className="flex flex-col gap-y-12 justify-center w-[52vw] md:w-[40vw]">
            <div className="flex flex-col items-start">
              <h3 className="flex items-center justify-between w-full text-xl font-semibold gap-5">
                1. Tell us about your place
                {step && (
                  <label className="hidden lg:flex items-center gap-3 text-sm">
                    {step > stepLengthsWithoutStepPages[0] ? stepLengthsWithoutStepPages[0] : step}/
                    {getTotalSteps(stepLengthsWithoutStepPages[1], stepLengthsWithoutStepPages[2])}
                    <span className="hidden 2xl:flex">Completed</span>
                    <Checkbox
                      id="state"
                      disabled={true}
                      checked={step > stepLengthsWithoutStepPages[0] ? true : false}
                    />
                  </label>
                )}
              </h3>
              <div>Location, size, and details.</div>
            </div>
            <Separator />
            <div className="flex flex-col items-start">
              <h3 className="flex items-center justify-between w-full text-xl font-semibold gap-5">
                2. Make it stand out
                {step && (
                  <label className="hidden lg:flex items-center gap-3 text-sm">
                    {Math.min(
                      step - stepLengthsWithoutStepPages[0] - 1 > 0 ? step - stepLengthsWithoutStepPages[0] - 1 : 0,
                      stepLengthsWithoutStepPages[1]
                    )}
                    /{getTotalSteps(stepLengthsWithoutStepPages[0], stepLengthsWithoutStepPages[2])}
                    <span className="hidden 2xl:flex">Completed</span>
                    <Checkbox
                      id="state"
                      disabled={true}
                      checked={step > stepLengthsWithoutStepPages[0] + stepLengthsWithoutStepPages[1] ? true : false}
                    />
                  </label>
                )}
              </h3>
              <div>Upload 5 or more photos, a title, and a description.</div>
            </div>
            <Separator />
            <div className="flex flex-col items-start">
              <h3 className="flex items-center justify-between w-full text-xl font-semibold gap-5">
                3. Finish up and publish
                {step && (
                  <label className="hidden lg:flex text-md items-center gap-3 text-sm">
                    {step - stepLengthsWithoutStepPages[0] - stepLengthsWithoutStepPages[1] - 2 > 0
                      ? step - stepLengthsWithoutStepPages[0] - stepLengthsWithoutStepPages[1] - 2
                      : 0}
                    /{getTotalSteps(stepLengthsWithoutStepPages[0], stepLengthsWithoutStepPages[1])}
                    <span className="hidden 2xl:flex">Completed</span>
                    <Checkbox
                      id="state"
                      disabled={true}
                      checked={
                        step >
                        stepLengthsWithoutStepPages[0] + stepLengthsWithoutStepPages[1] + stepLengthsWithoutStepPages[2]
                          ? true
                          : false
                      }
                    />
                  </label>
                )}
              </h3>
              <div>Add contact details, your price, and publish.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
