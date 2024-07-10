"use client";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter, usePathname } from "next/navigation";
import { SellContext } from "@/context/SellContext";
import { sellSteps, stepsFlattened, stepLengths } from "@/lib/sellFlowData";
import { updateHome } from "@/app/sell/actions";

export default function ProgressBar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    nextStep,
    prevStep,
    stepPercentage,
    currentHome,
    setCurrentHome,
    isLoading,
    setIsLoading,
    newHome,
    sellFlowFlatIndex,
  } = useContext(SellContext);

  router.prefetch(nextStep);
  router.prefetch(prevStep);

  console.log("currentHome", JSON.stringify(currentHome));
  console.log("newHome", JSON.stringify(newHome));

  const checkStepPositionForNextNavigation = () => {
    if (currentHome) {
      const step = currentHome.listingFlowStep;
      console.log("current step", step);
      if (step <= stepLengths[0] - 1) {
        return step;
      } else if (step <= stepLengths[0] - 1 + stepLengths[1] - 1) {
        return step - 1;
      } else {
        return step - 2;
      }
    } else {
      return 1;
    }
  };

  const shouldIncrementFlowStep = () => {
    const nextStepUpTo = checkStepPositionForNextNavigation();
    console.log("nextStepUpTo", nextStepUpTo);
    console.log("sellFlowFlatIndex", sellFlowFlatIndex);
    console.log("equivalent", sellFlowFlatIndex === nextStepUpTo);
    if (sellFlowFlatIndex < nextStepUpTo) {
      return false;
    } else if (sellFlowFlatIndex === nextStepUpTo) {
      console.log("running this XXX");
      return true;
    } else {
      return false;
    }
  };

  const shouldIncreaseListingFlowStep = shouldIncrementFlowStep();
  console.log("test123123");

  const isButtonDisabled = (): boolean => {
    if (isLoading) {
      return true; // Button disabled if loading
    }

    const _shouldIncreaseListingFlowStep = shouldIncrementFlowStep();
    console.log("shouldIncreaseListingFlowStep HEHEH", _shouldIncreaseListingFlowStep);

    if (_shouldIncreaseListingFlowStep) {
      if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
        console.log("button should not be disabled");
        return false;
      } else {
        console.log("button should be disabled");
        return true;
      }
    } else {
      console.log("button should be disabled because we should not increment the flow step");
      return true;
    }
  };

  const [nextButtonDisabled, setNextButtonDisabled] = useState(isButtonDisabled());

  useEffect(() => {
    console.log("newHome", newHome);
  }, [newHome]);

  useEffect(() => {
    console.log("nextButtonDisabled", nextButtonDisabled);
  }, [nextButtonDisabled]);

  useEffect(() => {
    console.log("running the next button use Effect");
    const newButton = isButtonDisabled();
    console.log("NEW BUTTON HOORAY", newButton);
    setNextButtonDisabled(newButton);
    console.log("finished running effect with new button", newButton);
  }, [currentHome, newHome, isLoading]);

  async function handleNext() {
    setIsLoading(true);
    if (prevStep === "" && currentHome) {
      // we are on the first page of the sell flow so we are redirected to where we are up too
      router.push(stepsFlattened[checkStepPositionForNextNavigation()]);
    } else if (prevStep === "" && !currentHome) {
      // we are on the first page of the sell flow and we need to create a new home
      const _newHome = await updateHome(newHome, pathname, true);
      setCurrentHome(_newHome);
      router.push(nextStep);
    } else if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
      const _newHome = await updateHome(newHome, pathname, shouldIncreaseListingFlowStep);
      setCurrentHome(_newHome);
      router.push(nextStep);
    } else {
      router.push(nextStep);
    }
  }

  async function handlePrev() {
    if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
      setIsLoading(true);
      const _newHome = await updateHome(newHome, pathname, shouldIncreaseListingFlowStep);
      setCurrentHome(_newHome);
    }
    router.push(prevStep);
  }

  return (
    <div className="flex flex-col justify-start gap-6 items-center w-full h-[100px]">
      <div className="flex justify-between items-center gap-1 w-full">
        {sellSteps.map((_, idx) => (
          <div key={idx} className="flex justify-center items-center w-full">
            <Progress value={stepPercentage[idx]} />
          </div>
        ))}
      </div>
      <div className="flex flex-row-reverse justify-between w-full px-8">
        {nextStep !== "" && (
          <div className="flex">
            <Button variant="default" size="lg" onClick={handleNext} disabled={nextButtonDisabled}>
              {!isLoading ? (prevStep !== "" ? "Next" : currentHome ? "Continue listing" : "Start") : "Loading..."}
            </Button>
          </div>
        )}
        {prevStep !== "" && (
          <div className="flex justify-start">
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={isLoading}>
              {!isLoading ? "Back" : "Loading..."}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
