"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { HomeType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { User } from "next-auth";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import BrokenPrice from "@/components/BrokenPrice";

interface Props {
  home: HomeType;
  user?: User;
}

export default function StickyPrice({ home, user }: Props) {
  const { defaultCurrency, currencies } = useContext(LocaleContext);
  const { openLogInModal, isModalOpen, revealPrice, setRevealPrice } = useContext(QueryContext);
  const originalCurrencyRate = currencies.find((c) => home.currency === c.symbol)?.usdPrice ?? null;

  useEffect(() => {
    console.log(isModalOpen);
  }, [isModalOpen]);

  return (
    <CardHeader className={`flex flex-col gap-y-2 items-center bg-primary/90`}>
      <div className="flex flex-row items-end justify-between w-full">
        <CardTitle className={`flex flex-col text-white dark:text-black items-start w-1/2`}>
          <span className="font-light">Price:</span>
          <span className="text-xl font-semibold">
            <BrokenPrice
              home={home}
              newCurrencySymbol={defaultCurrency.symbol}
              newCurrencyUsdPrice={defaultCurrency.usdPrice}
              user={user}
              blur={revealPrice}
              blurAmount="blur-sm"
              className="mb-0"
            />
          </span>
        </CardTitle>
        <CardDescription className={`flex flex-col text-white dark:text-black w-1/2 h-full text-end `}>
          <span className="text-xs">Original price ({home.currency})</span>
          <span className="flex justify-end gap-2 text-lg font-semibold">
            {originalCurrencyRate && home.currency ? (
              <BrokenPrice
                home={home}
                newCurrencySymbol={home.currency}
                newCurrencyUsdPrice={originalCurrencyRate}
                user={user}
                blur={revealPrice}
                blurAmount="blur-sm"
                className="mb-0"
              />
            ) : (
              "Contact us to know"
            )}
          </span>
        </CardDescription>
      </div>
      {!user && (
        <Button
          onClick={() => {
            user ? setRevealPrice(!revealPrice) : openLogInModal();
          }}
          variant={"outline"}
          className="flex w-full px-4 justify-center text-center"
        >
          <div className="flex gap-2 w-[150px] justify-center">
            {revealPrice || isModalOpen ? <EyeOpenIcon className="w-4 h-4" /> : <EyeClosedIcon className="w-4 h-4" />}
            <span className="text-xs">{`${revealPrice ? "Hide" : "Reveal"} the price!`}</span>
          </div>
        </Button>
      )}
    </CardHeader>
  );
}
