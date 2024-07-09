"use client";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
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

  const checkStepPositionForNextNavigation = () => {
    if (currentHome) {
      const step = currentHome.listingFlowStep;
      if (step <= stepLengths[0] - 1) {
        return step;
      } else if (step <= stepLengths[0] - 1 + stepLengths[1] - 1) {
        return step - 1;
      } else {
        return step - 2;
      }
    } else {
      throw new Error("Current home is not defined");
    }
  };

  const shouldNavigate = () => {
    const nextStepUpTo = currentHome ? checkStepPositionForNextNavigation() : 0;
    if (sellFlowFlatIndex <= nextStepUpTo - 1) {
      return false; // Button not disabled if sellFlowFlatIndex <= stepPosition-1
    } else {
      return true;
    }
  };

  const shouldIncreaseListingFlowStep = shouldNavigate();

  const isButtonDisabled = (): boolean => {
    if (!shouldIncreaseListingFlowStep) {
      return false;
    }

    if (isLoading) {
      return true; // Button disabled if loading
    }

    // Default condition: disable the button if currentHome and newHome are deeply equal and prevStep is not empty
    return (
      JSON.stringify(currentHome) === JSON.stringify(newHome) && prevStep !== "" && !pathname.startsWith("/sell/step")
    );
  };

  async function handleNext() {
    setIsLoading(true);
    if (prevStep === "" && currentHome) {
      // we are on the first page of the sell flow so we are redirected to where we are up too
      router.push(stepsFlattened[checkStepPositionForNextNavigation()]);
    } else if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
      console.log("running thisNOWOWOWOWOWOWOWO!!!!");
      console.log("different current home", JSON.stringify(currentHome));
      console.log("different new home", JSON.stringify(newHome));
      const _newHome = await updateHome(newHome, pathname, shouldIncreaseListingFlowStep);
      console.log("updatedHome", _newHome);
      setCurrentHome(_newHome);
      router.push(nextStep);
    } else {
      console.log("running this!!!");
      router.push(nextStep);
    }
  }

  async function handlePrev() {
    if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
      setIsLoading(true);
      const _newHome = await updateHome(newHome, pathname, shouldIncreaseListingFlowStep);
      setCurrentHome(_newHome);
    } else {
      console.log("run this shit!");
    }
    router.push(prevStep);
  }

  console.log("current", JSON.stringify(currentHome, null, 2));
  console.log("new", JSON.stringify(newHome, null, 2));
  console.log("state", JSON.stringify(currentHome) === JSON.stringify(newHome));

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
            <Button variant="default" size="lg" onClick={handleNext} disabled={isButtonDisabled()}>
              {!isLoading ? (prevStep === "" ? "Continue listing" : "Next") : "Loading..."}
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
