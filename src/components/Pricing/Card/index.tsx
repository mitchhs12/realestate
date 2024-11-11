import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Props {
  id: string;
  perks: {
    title: string;
    subtitle: string;
  }[];
  title: string;
  button: number;
  annualPrice: number;
  buttonDisabled: boolean;
  originalPrice?: number;
  buttonFunction: () => void;
  selected: string;
  defaultCurrency: {
    symbol: string;
    usdPrice: number;
  };
  yearly: boolean;
  setYearly: (yearly: boolean) => void;
  subscribe: string;
  currentPlan: string;
  billedAnnually: string;
  monthlyBilling: string;
  yearlyBilling: string;
  sixMonthsFree: string;
  blurb?: string;
}

export default function PriceCard({
  id,
  perks,
  title,
  button,
  annualPrice,
  buttonDisabled,
  buttonFunction,
  selected,
  defaultCurrency,
  yearly,
  setYearly,
  subscribe,
  currentPlan,
  billedAnnually,
  monthlyBilling,
  yearlyBilling,
  sixMonthsFree,
  blurb,
}: Props) {
  return (
    <div className={`flex w-full h-full justify-center items-center`}>
      <Card className={`flex flex-col w-full h-full border-2 rounded-lg ${selected === id ? "border-primary" : ""}`}>
        <CardHeader>
          <CardTitle className="flex justify-center items-center text-bold text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-grow px-3">
          <div className="flex justify-center gap-2 text-4xl font-medium items-center">
            {formatPrice(defaultCurrency.symbol, defaultCurrency.usdPrice * button, 0)}
            {yearly && (
              <div className="flex flex-col text-xs text-start">
                <p>6+ months free</p>
                <p>per month</p>
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
          {perks.map((perk, index) => (
            <div key={index} className="flex items-start gap-4 px-3">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
              <div className="flex flex-col justify-start space-y-1 text-start">
                <p className="flex justify-start text-md font-medium leading-none">{perk.title}</p>
                <p className="flex justify-start text-sm text-muted-foreground">{perk.subtitle}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col items-center h-[90px] justify-end pb-5 gap-2">
          <Button
            variant={"default"}
            className="flex items-center w-full text-xl gap-1"
            disabled={buttonDisabled}
            onClick={buttonFunction}
          >
            {buttonDisabled ? currentPlan : subscribe}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
