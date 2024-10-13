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
  const localePathname = usePathname();
  const currentLocale = useCurrentLocale();
  const pathname = localePathname.replace(`/${currentLocale}`, "");
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
  // console.log("currentHome", JSON.stringify(currentHome));
  // console.log("newHome", JSON.stringify(newHome));

  const checkStepPositionForNextNavigation = () => {
    return currentHome ? currentHome.listingFlowStep : 1;
  };

  const shouldIncrementFlowStep = () => {
    const nextStepUpTo = checkStepPositionForNextNavigation();
    // console.log("nextStepUpTo", nextStepUpTo);
    // console.log("sellFlowFlatIndex", sellFlowFlatIndex);
    // console.log("equivalent", sellFlowFlatIndex === nextStepUpTo);
    if (sellFlowFlatIndex < nextStepUpTo) {
      return false;
    } else if (sellFlowFlatIndex === nextStepUpTo) {
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
        // console.log("button should be active because we are on a intro step page");
        return false;
      } else if (JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
        // console.log("button should be active because new home is different from current home");
        return false;
      } else if (pathname.startsWith("/sell/review")) {
        console.log("button should be active because we are on the final page");
        return false;
      } else if (currentHome?.listingType === "premium") {
        return false;
      } else {
        // console.log("button should be DISABLED because new home is the same as current home");
        return true;
      }
    } else {
      // console.log("button should be active because we are not incrementing the flow step");
      return false;
    }
  };

  const nextButtonDisabled = isButtonDisabled();

  async function handleNext() {
    setNextLoading(true);
    if (prevStep === "" && currentHome) {
      // console.log("running log 1");
      // we are on the first page of the sell flow so we are redirected to where we are up too
      router.push(stepsFlattened[checkStepPositionForNextNavigation()]);
    } else if (prevStep === "" && !currentHome) {
      // console.log("running log 2");
      // we are on the first page of the sell flow and we need to create a new home
      const _newHome = await updateHome(newHome, pathname, true);
      router.push(nextStep);
    } else if (currentHome && newHome && JSON.stringify(currentHome) !== JSON.stringify(newHome)) {
      // console.log("running log 3");
      console.log(JSON.stringify(newHome, null, 2));
      const _newHome = await updateHome(newHome, pathname, shouldIncrementFlowStep(), isMyPhone);
      router.push(nextStep);
    } else if (shouldIncrementFlowStep()) {
      // console.log("running log 4");
      if (sellFlowFlatIndex === stepsFlattened.length - 1) {
        const result = await sellHome(currentLocale, pathname);
        if (result.error) {
          alert(result.error);
          setNextLoading(false);
        } else {
          router.push(`/homes/${currentHome?.id}`);
        }
      } else {
        // console.log("INCREMENTING FLOW STEP");
        if (newHome) {
          const _newHome = await updateHome(newHome, pathname, true);
          setNewHome(_newHome);
          router.push(nextStep);
        } else {
          // newHome is null because we are navigating to the end page without making any changes
          // the only time this should run is if we are up to the last page the user is up too and they click next, newHome is null or the two are the same.
          const _newHome = await updateHome(currentHome, pathname, true);
          setNewHome(_newHome);
          router.push(nextStep);
        }
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
