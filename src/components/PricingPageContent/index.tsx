"use client";

import PricingTable from "@/components/PricingPageContent/PricingTable";
import { urbanist } from "@/app/[locale]/fonts";
import { Button } from "@/components/ui/button";
import { LocaleContext } from "@/context/LocaleContext";
import { useState, useContext, useEffect } from "react";
import { changeSellerMode } from "@/app/[locale]/actions";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/Icons/icons";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

interface Props {
  isCheckout: boolean;
  sellerObject: any;
  buyerObject: any;
  billingText: {
    sellerModeSelection: {
      title: string;
      subtitle: string;
    };
    changeAccount: string;
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
  justPremium?: boolean;
}

export default function PricingPageContent({
  isCheckout,
  redirectUrl,
  sellerObject,
  buyerObject,
  billingText,
  justPremium,
}: Props) {
  const { user } = useContext(LocaleContext);
  const [sellerModeLoading, setSellerModeLoading] = useState(false);
  const [handleChangeSeller, setHandleChangeSeller] = useState<string | null>(null);
  const [buyerModeLoading, setBuyerModeLoading] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const { resolvedTheme: theme } = useTheme();
  const session = useSession();

  useEffect(() => {
    const updateSellerMode = async () => {
      if (!handleChangeSeller) return;
      setButtonsDisabled(true);

      try {
        if (handleChangeSeller === "seller") {
          setSellerModeLoading(true);
          await changeSellerMode(true);
          setSellerModeLoading(false);
        } else if (handleChangeSeller === "buyer") {
          setBuyerModeLoading(true);
          await changeSellerMode(false);
          setBuyerModeLoading(false);
        }
      } catch (error) {
        console.error("Error updating seller mode:", error);
        alert("Failed to update mode. Please try again later.");
      } finally {
        setSellerModeLoading(false);
        setBuyerModeLoading(false);
        setButtonsDisabled(false);
        session.update();
      }
    };

    updateSellerMode();
  }, [handleChangeSeller]);

  if (user) {
    if (user.isSellerMode === null) {
      return (
        <div className="flex flex-col gap-5 pt-12 justify-center items-center">
          <div className="flex flex-col w-full">
            <h3 className="text-center text-xl sm:text-3xl">{billingText.sellerModeSelection.title}</h3>
          </div>
          <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-3">
            <Button
              onClick={() => {
                setHandleChangeSeller("buyer");
              }}
              className="h-20 rounded-md px-8 w-[275px]"
              disabled={buttonsDisabled}
              variant={"default"}
            >
              <div className="flex items-center gap-3 text-2xl">
                <Icons.buyer_icon width={"50"} height={"50"} color={theme === "dark" ? "#000000" : "#FFFFFF"} />
                {buyerModeLoading ? <ReloadIcon className="animate-spin w-5 h-5" /> : billingText["buyersText"]}
              </div>
            </Button>
            <Button
              onClick={() => {
                setHandleChangeSeller("seller");
              }}
              className="h-20 rounded-md px-8 w-[275px]"
              disabled={buttonsDisabled}
              variant={"default"}
              size={"lg"}
            >
              <div className="flex items-center gap-3 text-2xl">
                <Icons.seller_icon width={"50"} height={"50"} color={theme === "dark" ? "#000000" : "#FFFFFF"} />
                {sellerModeLoading ? <ReloadIcon className="animate-spin w-5 h-5" /> : billingText["sellersText"]}
              </div>
            </Button>
          </div>
          <div className="flex flex-col w-full">
            <h4 className="text-center">{billingText.sellerModeSelection.subtitle}</h4>
          </div>
        </div>
      );
    } else {
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
                  {user.isSellerMode ? billingText.sellersText : billingText.buyersText} {billingText.title}
                </h2>
              </div>
            )}

            {user.isSellerMode ? (
              <PricingTable
                isCheckout={isCheckout}
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
                changeAccount={billingText["changeAccount"]}
                billedAnnually={billingText["billed-annually"]}
                monthlyBilling={billingText["view-monthly-billing"]}
                yearlyBilling={billingText["save-with-yearly"]}
                sixMonthsFree={billingText["six-months-free"]}
                subText={billingText.subText}
                isSeller={true}
                justPremium={justPremium}
              />
            ) : (
              <PricingTable
                isCheckout={isCheckout}
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
                changeAccount={billingText["changeAccount"]}
                billedAnnually={billingText["billed-annually"]}
                monthlyBilling={billingText["view-monthly-billing"]}
                yearlyBilling={billingText["save-with-yearly"]}
                sixMonthsFree={billingText["six-months-free"]}
                subText={billingText.subText}
                isSeller={false}
              />
            )}
          </div>
        </section>
      );
    }
  } else {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <ReloadIcon className="animate-spin w-5 h-5" />
      </div>
    );
  }
}
