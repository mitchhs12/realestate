"use client";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useRouter, usePathname } from "next/navigation";
import { SellContext } from "@/context/SellContext";
import { sellSteps, stepsFlattened } from "@/lib/sellFlowData";
import { updateHome, sellHome } from "@/app/[locale]/sell/actions";
import { useCurrentLocale } from "@/locales/client";
import { getStepData } from "@/lib/sellFlowData";

interface Props {
  cont: string;
  start: string;
  back: string;
  next: string;
  loading: string;
  finish: string;
}

export default function ProgressBar({ cont, start, back, next, finish, loading }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useCurrentLocale();
  const {
    nextStep,
    prevStep,
    stepPercentage,
    currentHome,
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
      router.push(nextStep);
    } else if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
      console.log("we are updating the home now!");
      const _newHome = await updateHome(newHome, pathname, shouldIncrementFlowStep(), isMyPhone);
      router.push(nextStep);
    } else if (shouldIncrementFlowStep()) {
      console.log("WE SHOULD INCREMENT THE FLOW STEP");
      if (pathname.startsWith("/sell/review")) {
        const result = await sellHome(currentLocale, pathname);
        if (result.error) {
          alert(result.error);
          setNextLoading(false);
        } else {
          router.push(nextStep);
        }
      } else {
        console.log("INCREMENTING FLOW STEP");
        const _newHome = await updateHome(newHome, pathname, true);
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
      await updateHome(newHome, pathname, false);
    }
    router.push(prevStep);
  }

  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);

  let currentArrayProgress: number[] = Array(sellSteps.length).fill(0);
  if (prevStep === "" && currentHome) {
    const { array } = getStepData(stepsFlattened[checkStepPositionForNextNavigation()]);
    currentArrayProgress = array;
  }

  useEffect(() => {
    if (currentAnimationStep < sellSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentAnimationStep((prevStep) => prevStep + 1);
      }, 150); // 1 second delay between each animation
      return () => clearTimeout(timer);
    }
  }, [currentAnimationStep, sellSteps.length]);

  return (
    <div className="flex flex-col justify-start gap-6 items-center w-full h-[100px]">
      <div className="flex justify-between items-center gap-1 w-full">
        {sellSteps.map((_, idx) => (
          <div key={idx} className="flex justify-center items-center w-full">
            <Progress
              style={{
                opacity: prevStep === "" && currentHome ? 0.2 : 1, // Adjust opacity conditionally
              }}
              value={
                prevStep === "" && currentHome
                  ? currentArrayProgress[idx]
                  : idx <= currentAnimationStep
                  ? stepPercentage[idx]
                  : 0
              }
            />
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
                    ? finish
                    : next
                  : currentHome
                  ? cont
                  : start
                : loading}
            </Button>
          </div>
        )}
        {prevStep !== "" && (
          <div className="flex justify-start">
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={prevLoading || nextLoading}>
              {!prevLoading ? back : loading}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
