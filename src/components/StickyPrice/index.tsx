"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { HomeType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { User } from "next-auth";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

interface Props {
  home: HomeType;
  user?: User;
}

export default function StickyPrice({ home, user }: Props) {
  const { defaultCurrency, currencies } = useContext(LocaleContext);
  const { openLogInModal, revealPrice, setRevealPrice } = useContext(QueryContext);
  const originalCurrencyRate = currencies.find((c) => home.currency === c.symbol)?.usdPrice ?? null;

  return (
    <CardHeader className={`flex flex-col gap-y-2 items-center bg-primary`}>
      <div className="flex flex-row items-end justify-between w-full">
        <CardTitle className={`flex flex-col text-white items-start w-1/2 ${!revealPrice && "blur-md"}`}>
          <p className="font-light">Price:</p>
          <p className="text-3xl font-semibold">
            {formatPrice(defaultCurrency.symbol, home.priceUsd, defaultCurrency.usdPrice)}
          </p>
        </CardTitle>
        <CardDescription className={`flex flex-col text-white w-1/2 h-full text-end ${!revealPrice && "blur-sm"}`}>
          <p className="text-xs">Original price ({home.currency})</p>
          <p className="flex justify-end gap-2 text-lg font-semibold">
            {originalCurrencyRate && home.currency
              ? formatPrice(home.currency, home.price, originalCurrencyRate)
              : "Contact us"}
          </p>
        </CardDescription>
      </div>
      <Button
        onClick={() => {
          user ? setRevealPrice(!revealPrice) : openLogInModal();
        }}
        variant={"outline"}
        className="flex w-full px-4 justify-center text-center"
      >
        <div className="flex gap-2 w-[150px] justify-center">
          {revealPrice ? <EyeOpenIcon className="w-4 h-4" /> : <EyeClosedIcon className="w-4 h-4" />}
          <span className="text-xs">{`${revealPrice ? "Hide" : "Reveal"} the price!`}</span>
        </div>
      </Button>
    </CardHeader>
  );
}
