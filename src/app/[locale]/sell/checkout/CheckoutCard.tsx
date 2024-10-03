import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";

interface Props {
  id: string;
  perks: {
    title: string;
    subtitle: string;
  }[];
  title: string;
  description: string;
  button: number | string;
  buttonDisabled: boolean;
  originalPrice?: number;
  buttonFunction: () => void;
  selected: string;
  defaultCurrency: {
    symbol: string;
    usdPrice: number;
  };
}

export default function CheckoutCard({
  id,
  perks,
  title,
  description,
  button,
  buttonDisabled,
  originalPrice,
  buttonFunction,
  selected,
  defaultCurrency,
}: Props) {
  return (
    <div className={`flex w-full h-full justify-center items-center`}>
      <Card
        className={`flex flex-col w-[340px] md:[400px] h-[440px] border-2 rounded-lg ${selected === id ? "border-primary" : ""}`}
      >
        <CardHeader>
          <CardTitle className="flex justify-center items-center text-bold">{title}</CardTitle>
          <CardDescription className="flex justify-center items-center text-light">{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 flex-grow">
          {perks.map((perk, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
              <div className="flex flex-col justify-start space-y-1 text-start">
                <p className="flex justify-start text-md font-medium leading-none">{perk.title}</p>
                <p className="flex justify-start text-sm text-muted-foreground">{perk.subtitle}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col items-center h-[90px] justify-end">
          {originalPrice && (
            <span className="text-md text-muted-foreground line-through">
              {formatPrice(defaultCurrency.symbol, defaultCurrency.usdPrice * originalPrice)} per month
            </span>
          )}
          <Button variant={"default"} className="w-full text-lg" disabled={buttonDisabled} onClick={buttonFunction}>
            {typeof button === "number"
              ? formatPrice(defaultCurrency.symbol, defaultCurrency.usdPrice * button)
              : button}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
