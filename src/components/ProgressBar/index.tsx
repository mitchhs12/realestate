"use client";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter, usePathname } from "next/navigation";
import { SellContext } from "@/context/SellContext";
import { sellSteps, stepsFlattened, stepLengths } from "@/lib/sellFlowData";
import { updateHome, sellHome } from "@/app/[locale]/sell/actions";
import { updatePhone } from "@/app/[locale]/settings/actions";

export default function ProgressBar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    nextStep,
    prevStep,
    stepPercentage,
    currentHome,
    setCurrentHome,
    nextLoading,
    prevLoading,
    setNextLoading,
    setPrevLoading,
    newHome,
    sellFlowFlatIndex,
    setNewHome,
    nextDisabled,
    isMyPhone,
  } = useContext(SellContext);

  router.prefetch(nextStep);
  router.prefetch(prevStep);

  console.log("currentHome", JSON.stringify(currentHome));
  console.log("newHome", JSON.stringify(newHome));

  const checkStepPositionForNextNavigation = () => {
    if (currentHome) {
      const databaseStep = currentHome.listingFlowStep;
      return databaseStep;
      // console.log("current databaseStep as recorded in currentHome", databaseStep);
      // if (databaseStep <= stepLengths[0] - 1) {
      //   console.log("IN 1st STEP CONDITIONAL");
      //   return databaseStep;
      // } else if (databaseStep <= stepLengths[0] - 1 + stepLengths[1] - 1) {
      //   console.log("IN 2nd STEP CONDITIONAL");
      //   return databaseStep + 1;
      // } else {
      //   console.log("IN 3rd STEP CONDITIONAL");
      //   return databaseStep + 2;
      // }
    } else {
      return 1;
    }
  };

  const shouldIncrementFlowStep = () => {
    const nextStepUpTo = checkStepPositionForNextNavigation();
    // console.log("nextStepUpTo", nextStepUpTo);
    // console.log("sellFlowFlatIndex", sellFlowFlatIndex);
    // console.log("equivalent", sellFlowFlatIndex === nextStepUpTo);
    if (sellFlowFlatIndex < nextStepUpTo) {
      return false;
    } else if (sellFlowFlatIndex === nextStepUpTo) {
      console.log("running this XXX");
      return true;
    } else {
      return false;
    }
  };

  const isButtonDisabled = (): boolean => {
    if (nextLoading) {
      return true; // Button disabled if loading
    }

    const _shouldIncreaseListingFlowStep = shouldIncrementFlowStep();
    // console.log("shouldIncreaseListingFlowStep:", _shouldIncreaseListingFlowStep);

    if (_shouldIncreaseListingFlowStep) {
      if (pathname.startsWith("/sell/step")) {
        // console.log("button should not be disabled because we are on a intro step page");
        return false;
      } else if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
        // console.log("button should not be disabled because new home is different from current home");
        return false;
      } else if (pathname.startsWith("/sell/review")) {
        // console.log("button should not be disabled because we are on the final page");
        return false;
      } else {
        // console.log("button should be disabled because new home is the same as current home");
        return true;
      }
    } else {
      // console.log("button should not be disabled because we are not incrementing the flow step");
      return false;
    }
  };

  const nextButtonDisabled = isButtonDisabled();

  async function handleNext() {
    setNextLoading(true);
    if (prevStep === "" && currentHome) {
      // we are on the first page of the sell flow so we are redirected to where we are up too
      router.push(stepsFlattened[checkStepPositionForNextNavigation()]);
    } else if (prevStep === "" && !currentHome) {
      // we are on the first page of the sell flow and we need to create a new home
      const _newHome = await updateHome(newHome, pathname, true);
      setCurrentHome(_newHome);
      router.push(nextStep);
    } else if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
      const _newHome = await updateHome(newHome, pathname, shouldIncrementFlowStep(), isMyPhone);
      setCurrentHome(_newHome);
      setNewHome(_newHome);
      router.push(nextStep);
    } else if (shouldIncrementFlowStep()) {
      if (pathname.startsWith("/sell/review")) {
        const result = await sellHome();
        if (result.error) {
          alert(result.error);
          setNextLoading(false);
        } else {
          router.push(nextStep);
        }
      } else {
        const _newHome = await updateHome(newHome, pathname, true);
        setCurrentHome(_newHome);
        setNewHome(_newHome);
        router.push(nextStep);
      }
    } else {
      router.push(nextStep);
    }
  }

  async function handlePrev() {
    if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
      setPrevLoading(true);
      const _newHome = await updateHome(newHome, pathname, false);
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
            <Button
              variant="default"
              size="lg"
              onClick={handleNext}
              disabled={nextButtonDisabled || nextDisabled || prevLoading}
            >
              {!nextLoading
                ? prevStep !== ""
                  ? pathname.startsWith("/sell/review")
                    ? "Finish!"
                    : "Next"
                  : currentHome
                  ? "Continue listing"
                  : "Start"
                : "Loading..."}
            </Button>
          </div>
        )}
        {prevStep !== "" && (
          <div className="flex justify-start">
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={prevLoading || nextLoading}>
              {!prevLoading ? "Back" : "Loading..."}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
