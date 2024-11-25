import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useContext, useEffect } from "react";
import { LocaleContext } from "@/context/LocaleContext";

import { Skeleton } from "@/components/ui/skeleton";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface Props {
  id: string;
  perks: {
    title: string;
    subtitle: string;
  }[];
  title: string;
  button: number;
  annualPrice: number;
  originalPrice?: number;
  buttonFunction: () => void;
  selected: string;
  yearly: boolean;
  setYearly: (yearly: boolean) => void;
  subscribe: string;
  currentPlan: string;
  billedAnnually: string;
  monthlyBilling: string;
  yearlyBilling: string;
  sixMonthsFree: string;
  blurb?: string;
  subText: {
    "six-months-free": string;
    "per-month": string;
  };
  isSeller: boolean;
}

type BuyerSubscriptionTier = "free" | "basic" | "insight" | "max";
type SellerSubscriptionTier = "starter" | "pro" | "premium" | "business";

export default function PriceCard({
  id,
  perks,
  title,
  button,
  annualPrice,
  buttonFunction,
  selected,
  yearly,
  setYearly,
  subscribe,
  currentPlan,
  billedAnnually,
  monthlyBilling,
  yearlyBilling,
  sixMonthsFree,
  blurb,
  subText,
  isSeller,
}: Props) {
  const { sessionLoading, defaultCurrency } = useContext(LocaleContext);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (!sessionLoading) {
      const sellIndex: Record<SellerSubscriptionTier, number> = {
        starter: 1,
        pro: 2,
        premium: 3,
        business: 4,
      };
      const buyIndex: Record<BuyerSubscriptionTier, number> = {
        free: 1,
        basic: 2,
        insight: 3,
        max: 4,
      };
      const index = isSeller ? sellIndex : buyIndex;
      const bool = index[id as keyof typeof index] > index[currentPlan as keyof typeof index];
      setButtonDisabled(bool);
    }
  }, [sessionLoading, currentPlan, id, isSeller]);

  // const buttonDisabled = isButtonDisabled(id as SellerSubscriptionTier | BuyerSubscriptionTier, isSeller);

  return (
    <div className={`flex w-full h-[850px] justify-center items-center`}>
      {sessionLoading ? (
        <Skeleton className="flex flex-grow w-full h-full" />
      ) : (
        defaultCurrency && (
          <Card
            className={`flex flex-col w-full h-full border-2 rounded-lg ${buttonDisabled && "border-none shadow-none opacity-70"} ${selected === id ? "border-primary" : ""}`}
          >
            <CardHeader>
              <CardTitle className="flex justify-center items-center text-bold text-2xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-grow px-3">
              <div className="flex justify-center gap-2 text-4xl font-medium items-center">
                {formatPrice(defaultCurrency.symbol, defaultCurrency.usdPrice * button, 0)}
                {yearly && (
                  <div className="flex flex-col text-xs text-start">
                    <p>{subText["six-months-free"]}</p>
                    <p>{subText["per-month"]}</p>
                  </div>
                )}
              </div>
              {yearly && (
                <p className="text-sm">
                  {billedAnnually} {formatPrice(defaultCurrency.symbol, defaultCurrency.usdPrice * annualPrice, 0)}
                </p>
              )}

              <Button
                variant={"link"}
                onClick={() => {
                  setYearly(!yearly);
                }}
              >
                {yearly ? (
                  monthlyBilling
                ) : (
                  <div>
                    <p>{yearlyBilling}</p>
                    <p>{sixMonthsFree}</p>
                  </div>
                )}
              </Button>

              <div>{blurb}</div>
              <div className="flex flex-col gap-5 w-full h-full">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-start gap-4 px-3">
                    <div>
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col justify-start gap-1 text-start">
                      <p className="flex justify-start text-md font-medium leading-none">{perk.title}</p>
                      <p className="flex justify-start text-sm text-muted-foreground">{perk.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center h-[90px] justify-end pb-5 gap-2">
              <Button
                variant={!buttonDisabled ? "default" : "secondary"}
                className="flex items-center w-full text-xl gap-1"
                disabled={buttonDisabled}
                onClick={buttonFunction}
              >
                {buttonDisabled ? (
                  currentPlan
                ) : selected === id ? (
                  <span className="flex items-center gap-3">
                    <ReloadIcon className="w-6 h-6 animate-spin" />
                  </span>
                ) : (
                  subscribe
                )}
              </Button>
            </CardFooter>
          </Card>
        )
      )}
    </div>
  );
}
