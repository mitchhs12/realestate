"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import Stripe from "@/app/[locale]/stripe";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PriceCard from "@/components/PricingPageContent/PricingTable/Card";
import { Button } from "@/components/ui/button";
import { QueryContext } from "@/context/QueryContext";
import { ChangeSpecificSub } from "@/app/[locale]/stripeServer";
import { useRouter } from "next/navigation";
import { StripeServer } from "@/app/[locale]/stripeServer";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

interface Tier {
  title: string;
  price: number;
  yearlyPrice: number;
  totalYearlyPrice: number;
  anchor?: number;
  blurb?: string;
  "monthly-perks": {
    title: string;
    subtitle: string;
  }[];
  "yearly-perks": {
    title: string;
    subtitle: string;
  }[];
}

interface Props {
  isCheckout: boolean;
  redirectUrl: string;
  starter: Tier;
  pro: Tier;
  premium: Tier;
  business: Tier;
  mostPopularText: string;
  subscribeText: string;
  currentPlanText: string;
  updatePlanText: string;
  yearlyText: string;
  monthlyText: string;
  changeAccount: string;
  billedAnnually: string;
  monthlyBilling: string;
  yearlyBilling: string;
  sixMonthsFree: string;
  subText: {
    "six-months-free": string;
    "per-month": string;
  };
  isSeller: boolean;
  justPremium?: boolean;
}

export default function PricingTable({
  isCheckout,
  redirectUrl,
  starter,
  pro,
  premium,
  business,
  mostPopularText,
  subscribeText,
  currentPlanText,
  updatePlanText,
  yearlyText,
  monthlyText,
  changeAccount,
  billedAnnually,
  monthlyBilling,
  yearlyBilling,
  sixMonthsFree,
  subText,
  isSeller,
  justPremium,
}: Props) {
  const { sessionLoading, defaultCurrency, user, defaultLanguage } = useContext(LocaleContext);
  const { openSignUpModal } = useContext(QueryContext);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [currentPlanExists, setCurrentPlanExists] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");
  const [yearly, setYearly] = useState(true);
  const router = useRouter();
  const uuidRef = useRef(uuidv4());

  const tier1 = isSeller ? "starter" : "free";
  const tier2 = isSeller ? "pro" : "basic";
  const tier3 = isSeller ? "premium" : "insight";
  const tier4 = isSeller ? "business" : "max";
  const userSubscription = isSeller ? user?.sellerSubscription : user?.buyerSubscription;
  const userSubscriptionId = isSeller ? user?.sellerSubscriptionId : user?.buyerSubscriptionId;

  useEffect(() => {
    if (user && isSeller) {
      if (user.sellerSubscription === "starter") {
        setCurrentPlan("starter");
        setCurrentPlanExists(true);
      } else if (user.sellerSubscription === "pro") {
        setCurrentPlan("pro");
        setCurrentPlanExists(true);
      } else if (user.sellerSubscription === "premium") {
        setCurrentPlan("premium");
        setCurrentPlanExists(true);
      } else if (user.sellerSubscription === "business") {
        setCurrentPlan("business");
        setCurrentPlanExists(true);
      } else {
        setCurrentPlanExists(false);
      }
    } else if (user && !isSeller) {
      if (user.buyerSubscription === "free") {
        setCurrentPlan("free");
        setCurrentPlanExists(true);
      } else if (user.buyerSubscription === "basic") {
        setCurrentPlan("basic");
        setCurrentPlanExists(true);
      } else if (user.buyerSubscription === "insight") {
        setCurrentPlan("insight");
        setCurrentPlanExists(true);
      } else if (user.buyerSubscription === "max") {
        setCurrentPlan("max");
        setCurrentPlanExists(true);
      } else {
        setCurrentPlanExists(false);
      }
    }
  }, [user, isSeller]);

  useEffect(() => {
    console.log(currentPlan);
  }, [currentPlan]);

  const handleButton = async (tierId: any) => {
    setSelected(tierId);
    if (!userSubscriptionId) {
      if (!user?.id) {
        openSignUpModal();
      } else {
        if (isCheckout && defaultCurrency) {
          const interval = yearly ? "year" : "month";
          StripeServer(
            defaultCurrency.symbol.toLowerCase(),
            defaultLanguage,
            tierId,
            interval,
            uuidRef.current,
            isCheckout,
            redirectUrl
          ).then((data) => {
            if (!data.error) {
              router.push(data.url as string);
            } else {
              console.log(data.error);
            }
          });
        } else {
          setIsOpen(true);
        }
      }
    } else if (userSubscriptionId) {
      const billingConfirm = await ChangeSpecificSub(isSeller, tierId, yearly, defaultLanguage, redirectUrl);
      router.push(billingConfirm);
    }
  };

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
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col-reverse xs:flex-row items-center gap-3">
              <Button
                className="disabled:bg-primary disabled:text-white dark:disabled:text-black disabled:opacity-100"
                variant={"outline"}
                disabled={!yearly}
                onClick={() => {
                  setYearly(false);
                }}
              >
                {monthlyText}
              </Button>
              <Button
                className="disabled:bg-primary disabled:text-white dark:disabled:text-black disabled:opacity-100"
                variant={"outline"}
                disabled={yearly}
                onClick={() => setYearly(true)}
              >
                {yearlyText}
              </Button>
            </div>
            <Button asChild variant={"link"} size={"sm"}>
              <Link href={"/settings"}>{changeAccount} </Link>
            </Button>
          </div>

          {justPremium ? (
            <PriceCard
              id={tier3}
              perks={yearly ? premium["yearly-perks"] : premium["monthly-perks"]}
              title={premium.title}
              button={yearly ? premium.yearlyPrice : premium.price}
              annualPrice={premium.totalYearlyPrice}
              buttonFunction={() => handleButton(tier3)}
              selected={selected}
              yearly={yearly}
              setYearly={setYearly}
              subscribe={currentPlanExists ? updatePlanText : subscribeText}
              currentPlan={currentPlan}
              currentPlanText={currentPlanText}
              billedAnnually={billedAnnually}
              monthlyBilling={monthlyBilling}
              yearlyBilling={yearlyBilling}
              sixMonthsFree={sixMonthsFree}
              blurb={premium.blurb}
              subText={subText}
              isSeller={isSeller}
            />
          ) : (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 justify-start w-full h-full gap-8 sm:gap-8 lg:gap-5`}
            >
              <PriceCard
                id={tier1}
                perks={yearly ? starter["yearly-perks"] : starter["monthly-perks"]}
                title={starter.title}
                button={yearly ? starter.yearlyPrice : starter.price}
                annualPrice={starter.totalYearlyPrice}
                originalPrice={starter.anchor}
                buttonFunction={() => handleButton(tier1)}
                selected={selected}
                yearly={yearly}
                setYearly={setYearly}
                subscribe={currentPlanExists ? updatePlanText : subscribeText}
                currentPlan={currentPlan}
                currentPlanText={currentPlanText}
                billedAnnually={billedAnnually}
                monthlyBilling={monthlyBilling}
                yearlyBilling={yearlyBilling}
                sixMonthsFree={sixMonthsFree}
                subText={subText}
                isSeller={isSeller}
              />
              <PriceCard
                id={tier2}
                perks={yearly ? pro["yearly-perks"] : pro["monthly-perks"]}
                title={pro.title}
                button={yearly ? pro.yearlyPrice : pro.price}
                annualPrice={pro.totalYearlyPrice}
                buttonFunction={() => handleButton(tier2)}
                selected={selected}
                yearly={yearly}
                setYearly={setYearly}
                subscribe={currentPlanExists ? updatePlanText : subscribeText}
                currentPlan={currentPlan}
                currentPlanText={currentPlanText}
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
                  perks={yearly ? premium["yearly-perks"] : premium["monthly-perks"]}
                  title={premium.title}
                  button={yearly ? premium.yearlyPrice : premium.price}
                  annualPrice={premium.totalYearlyPrice}
                  buttonFunction={() => handleButton(tier3)}
                  selected={selected}
                  yearly={yearly}
                  setYearly={setYearly}
                  subscribe={currentPlanExists ? updatePlanText : subscribeText}
                  currentPlan={currentPlan}
                  currentPlanText={currentPlanText}
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
                perks={yearly ? business["yearly-perks"] : business["monthly-perks"]}
                title={business.title}
                button={yearly ? business.yearlyPrice : business.price}
                annualPrice={business.totalYearlyPrice}
                buttonFunction={() => handleButton(tier4)}
                selected={selected}
                yearly={yearly}
                setYearly={setYearly}
                subscribe={currentPlanExists ? updatePlanText : subscribeText}
                currentPlan={currentPlan}
                currentPlanText={currentPlanText}
                billedAnnually={billedAnnually}
                monthlyBilling={monthlyBilling}
                yearlyBilling={yearlyBilling}
                sixMonthsFree={sixMonthsFree}
                blurb={business.blurb}
                subText={subText}
                isSeller={isSeller}
              />
            </div>
          )}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 border-0 bg-none w-80 md:w-full" close={false}>
          {defaultCurrency && user && (
            <Stripe
              uuid={uuidRef.current}
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
