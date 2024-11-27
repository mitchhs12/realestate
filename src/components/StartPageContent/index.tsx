"use client";

import PricingTable from "@/components/StartPageContent/PricingTable";
import { urbanist } from "@/app/[locale]/fonts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  sellerObject: any;
  buyerObject: any;
  billingText: {
    "most-popular": string;
    subscribe: string;
    "current-plan": string;
    "change-plan": string;
    yearly: string;
    monthly: string;
    "billed-annually": string;
    "view-monthly-billing": string;
    "save-with-yearly": string;
    "six-months-free": string;
    subText: { "six-months-free": string; "per-month": string };
    title: string;
    "lowest-prices": string;
    buyersText: string;
    sellersText: string;
  };
  redirectUrl: string;
  sellersOnly?: boolean;
  justPremium?: boolean;
}

export default function StartPageContent({
  sellerObject,
  buyerObject,
  billingText,
  redirectUrl,
  sellersOnly,
  justPremium,
}: Props) {
  const [seller, setSeller] = useState(true);

  return (
    <section className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-col pb-4 md:pb-12 gap-6 px-4 md:px-6 justify-start h-full w-full max-w-8xl">
        {!justPremium && (
          <div className="flex flex-col items-center gap-2 pt-6 justify-start text-center">
            <h3
              className={`${urbanist.className} tracking-widest font-medium text-lg sm:text-xl text-[#0C7A33] dark:text-primary`}
            >
              {billingText["lowest-prices"]}
            </h3>
            <h2 className="flex items-center gap-4 sm:text-3xl text-4xl font-semibold tracking-wider text-[#4F4F4F] dark:text-white">
              {billingText.title}
            </h2>
          </div>
        )}
        {!sellersOnly && (
          <div className="flex justify-center gap-3">
            <Button
              className="disabled:bg-primary disabled:text-white dark:disabled:text-black disabled:opacity-100 text-xl"
              variant={"outline"}
              size={"lg"}
              disabled={!seller}
              onClick={() => {
                setSeller(false);
              }}
            >
              {billingText.buyersText}
            </Button>
            <Button
              className="disabled:bg-primary disabled:text-white dark:disabled:text-black disabled:opacity-100 text-xl"
              variant={"outline"}
              size={"lg"}
              disabled={seller}
              onClick={() => setSeller(true)}
            >
              {billingText.sellersText}
            </Button>
          </div>
        )}

        {seller ? (
          <PricingTable
            redirectUrl={redirectUrl}
            starter={sellerObject.starter}
            pro={sellerObject.pro}
            premium={sellerObject.premium}
            business={sellerObject.business}
            mostPopularText={billingText["most-popular"]}
            subscribeText={billingText.subscribe}
            currentPlanText={billingText["current-plan"]}
            updatePlanText={billingText["change-plan"]}
            yearlyText={billingText.yearly}
            monthlyText={billingText.monthly}
            billedAnnually={billingText["billed-annually"]}
            monthlyBilling={billingText["view-monthly-billing"]}
            yearlyBilling={billingText["save-with-yearly"]}
            sixMonthsFree={billingText["six-months-free"]}
            subText={billingText.subText}
            isSeller={seller}
            justPremium={justPremium}
          />
        ) : (
          <PricingTable
            redirectUrl={redirectUrl}
            starter={buyerObject.free}
            pro={buyerObject.basic}
            premium={buyerObject.insight}
            business={buyerObject.max}
            mostPopularText={billingText["most-popular"]}
            subscribeText={billingText.subscribe}
            currentPlanText={billingText["current-plan"]}
            updatePlanText={billingText["change-plan"]}
            yearlyText={billingText.yearly}
            monthlyText={billingText.monthly}
            billedAnnually={billingText["billed-annually"]}
            monthlyBilling={billingText["view-monthly-billing"]}
            yearlyBilling={billingText["save-with-yearly"]}
            sixMonthsFree={billingText["six-months-free"]}
            subText={billingText.subText}
            isSeller={seller}
          />
        )}
      </div>
    </section>
  );
}
