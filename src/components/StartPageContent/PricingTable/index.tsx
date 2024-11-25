"use client";

import { useContext, useEffect, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import Stripe from "@/app/[locale]/stripe";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PriceCard from "@/components/StartPageContent/PricingTable/Card";
import { Button } from "@/components/ui/button";
import { QueryContext } from "@/context/QueryContext";
import { ChangeSpecificSub } from "@/app/[locale]/stripeServer";
import { useRouter } from "next/navigation";

interface Tier {
  title: string;
  price: number;
  yearlyPrice: number;
  totalYearlyPrice: number;
  anchor?: number;
  blurb?: string;
  perks: {
    title: string;
    subtitle: string;
  }[];
}

interface Props {
  starter: Tier;
  pro: Tier;
  premium: Tier;
  business: Tier;
  mostPopularText: string;
  subscribeText: string;
  currentPlanText: string;
  changePlanText: string;
  yearlyText: string;
  monthlyText: string;
  billedAnnually: string;
  monthlyBilling: string;
  yearlyBilling: string;
  sixMonthsFree: string;
  subText: {
    "six-months-free": string;
    "per-month": string;
  };
  isSeller: boolean;
}

export default function PricingTable({
  starter,
  pro,
  premium,
  business,
  mostPopularText,
  subscribeText,
  currentPlanText,
  changePlanText,
  yearlyText,
  monthlyText,
  billedAnnually,
  monthlyBilling,
  yearlyBilling,
  sixMonthsFree,
  subText,
  isSeller,
}: Props) {
  const { sessionLoading, defaultCurrency, user, defaultLanguage } = useContext(LocaleContext);
  const { openSignUpModal } = useContext(QueryContext);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [yearly, setYearly] = useState(true);
  const router = useRouter();

  const tier1 = isSeller ? "starter" : "free";
  const tier2 = isSeller ? "pro" : "basic";
  const tier3 = isSeller ? "premium" : "insight";
  const tier4 = isSeller ? "business" : "max";
  const userSubscription = isSeller ? user?.sellerSubscription : user?.buyerSubscription;
  const userSubscriptionId = isSeller ? user?.sellerSubscriptionId : user?.buyerSubscriptionId;

  console.log("userSUBSCRIPTION", userSubscription);

  useEffect(() => {
    if (user && isSeller) {
      if (user.sellerSubscription === "starter") {
        setCurrentPlan("starter");
      } else if (user.sellerSubscription === "pro") {
        setCurrentPlan("pro");
      } else if (user.sellerSubscription === "premium") {
        setCurrentPlan("premium");
      } else if (user.sellerSubscription === "business") {
        setCurrentPlan("business");
      }
    } else if (user && !isSeller) {
      if (user.buyerSubscription === "free") {
        setCurrentPlan("free");
      } else if (user.buyerSubscription === "basic") {
        setCurrentPlan("basic");
      } else if (user.buyerSubscription === "insight") {
        setCurrentPlan("insight");
      } else if (user.buyerSubscription === "max") {
        setCurrentPlan("max");
      }
    }
  }, [user, isSeller]);

  const handleButton = async (tierId: any) => {
    setSelected(tierId);
    if (!userSubscriptionId) {
      if (!user?.id) {
        openSignUpModal();
      } else {
        setIsOpen(true);
      }
    } else if (userSubscriptionId) {
      const billingConfirm = await ChangeSpecificSub(isSeller, tierId, yearly, defaultLanguage);
      router.push(billingConfirm);
    }
  };

  // useEffect(() => {
  //   if (!subscriptionType && selected) {
  //     if (!user?.id) {
  //       openSignUpModal();
  //     } else {
  //       setIsOpen(true);
  //     }
  //   } else if (subscriptionType && selected) {
  //     StripeBilling(isSeller, defaultLanguage, "subUpdateConfirm");
  //   }
  // }, [selected]);

  useEffect(() => {
    if (!isOpen) {
      if (userSubscription) {
        setSelected(userSubscription);
      } else {
        setSelected("");
      }
    }
  }, [isOpen]);

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-col w-full h-full justify-start items-center text-center gap-12">
          <div className="flex items-center gap-3">
            <Button
              variant={"default"}
              disabled={!yearly}
              onClick={() => {
                setYearly(false);
              }}
            >
              {monthlyText}
            </Button>
            <Button variant={"default"} disabled={yearly} className="gap-2" onClick={() => setYearly(true)}>
              {yearlyText}
            </Button>
          </div>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-start w-full h-full gap-8 sm:gap-8 lg:gap-5`}
          >
            <PriceCard
              id={tier1}
              perks={starter.perks}
              title={starter.title}
              button={yearly ? starter.yearlyPrice : starter.price}
              annualPrice={starter.totalYearlyPrice}
              originalPrice={starter.anchor}
              buttonFunction={() => handleButton(tier1)}
              selected={selected}
              yearly={yearly}
              setYearly={setYearly}
              subscribe={currentPlan ? changePlanText : subscribeText}
              currentPlan={currentPlanText}
              billedAnnually={billedAnnually}
              monthlyBilling={monthlyBilling}
              yearlyBilling={yearlyBilling}
              sixMonthsFree={sixMonthsFree}
              subText={subText}
              isSeller={isSeller}
            />
            <PriceCard
              id={tier2}
              perks={pro.perks}
              title={pro.title}
              button={yearly ? pro.yearlyPrice : pro.price}
              annualPrice={pro.totalYearlyPrice}
              buttonFunction={() => handleButton(tier2)}
              selected={selected}
              yearly={yearly}
              setYearly={setYearly}
              subscribe={currentPlan ? changePlanText : subscribeText}
              currentPlan={currentPlanText}
              billedAnnually={billedAnnually}
              monthlyBilling={monthlyBilling}
              yearlyBilling={yearlyBilling}
              sixMonthsFree={sixMonthsFree}
              blurb={pro.blurb}
              subText={subText}
              isSeller={isSeller}
            />
            <div className="relative flex flex-col justify-center items-center">
              {!sessionLoading && (
                <div className="absolute -top-2 z-30 shadow-lg transform -translate-x-1/2 bg-[#0C7A33] text-white text-sm px-4 rounded-full animate-bounce w-[150px]">
                  {mostPopularText}
                </div>
              )}
              <PriceCard
                id={tier3}
                perks={premium.perks}
                title={premium.title}
                button={yearly ? premium.yearlyPrice : premium.price}
                annualPrice={premium.totalYearlyPrice}
                buttonFunction={() => handleButton(tier3)}
                selected={selected}
                yearly={yearly}
                setYearly={setYearly}
                subscribe={currentPlan ? changePlanText : subscribeText}
                currentPlan={currentPlanText}
                billedAnnually={billedAnnually}
                monthlyBilling={monthlyBilling}
                yearlyBilling={yearlyBilling}
                sixMonthsFree={sixMonthsFree}
                blurb={premium.blurb}
                subText={subText}
                isSeller={isSeller}
              />
            </div>
            <PriceCard
              id={tier4}
              perks={business.perks}
              title={business.title}
              button={yearly ? business.yearlyPrice : business.price}
              annualPrice={business.totalYearlyPrice}
              buttonFunction={() => handleButton(tier4)}
              selected={selected}
              yearly={yearly}
              setYearly={setYearly}
              subscribe={currentPlan ? changePlanText : subscribeText}
              currentPlan={currentPlanText}
              billedAnnually={billedAnnually}
              monthlyBilling={monthlyBilling}
              yearlyBilling={yearlyBilling}
              sixMonthsFree={sixMonthsFree}
              blurb={business.blurb}
              subText={subText}
              isSeller={isSeller}
            />
          </div>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 border-0 bg-none w-80 md:w-full" close={false}>
          {defaultCurrency && user && (
            <Stripe
              defaultCurrency={defaultCurrency}
              planId={selected}
              interval={yearly ? "year" : "month"}
              accountId={user.id as string}
              accountEmail={user.email ? user.email : null}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
