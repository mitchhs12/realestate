"use client";

import { useContext, useEffect } from "react";
import { SellContext } from "@/context/SellContext";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeType } from "@/lib/validations";
import { usePathname } from "next/navigation";
import PricingDialog from "@/components/PricingPageContent/Dialog";

interface Tier {
  title: string;
  subtitle: string;
  price: number | string;
  anchor?: number;
  perks: {
    title: string;
    subtitle: string;
  }[];
}

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  premium: Tier;
  paidText: string;
}

export default function Checkout({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    setCurrentHome,
    setNextDisabled,
  } = useContext(SellContext);

  const { defaultLanguage } = useContext(LocaleContext);

  const pathname = usePathname();
  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${defaultLanguage}${pathname}`
      : `https://www.vivaideal.com/${defaultLanguage}${pathname}`;

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
  }, []);

  useEffect(() => {
    if (currentHome && currentHome.listingType) {
      setNextDisabled(false);
    }
  }, [currentHome]);

  return (
    <>
      <div className="flex flex-col h-full w-full gap-y-20">
        <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
          <div className="flex flex-col pb-4">
            <div className="flex items-center justify-center py-3">
              <h1 className="flex items-center text-3xl">{title}</h1>
            </div>
            <div className="flex flex-col px-8 mt-5">
              <h3 className="text-lg w-full">{subtitle}</h3>
            </div>
          </div>
          <div>
            <PricingDialog redirectUrl={redirectUrl} sellersOnly={true} justPremium={true} isCheckout={false} />
          </div>
        </div>
      </div>
    </>
  );
}
