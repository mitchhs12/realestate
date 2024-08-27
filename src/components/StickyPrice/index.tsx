"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HomeType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import BrokenPrice from "@/components/BrokenPrice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface Props {
  home: HomeType;
}

export default function StickyPrice({ home }: Props) {
  const { defaultCurrency, currencies } = useContext(LocaleContext);
  const { openLogInModal, isModalOpen, revealPrice, setRevealPrice, user, session } = useContext(QueryContext);
  const originalCurrencyRate = currencies.find((c) => home.currency === c.symbol)?.usdPrice ?? null;
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    console.log(isModalOpen);
  }, [isModalOpen]);

  return (
    <>
      <CardHeader className={`flex flex-col gap-y-2 items-center bg-primary/90`}>
        <div className="flex flex-row items-end justify-between w-full">
          <CardTitle className={`flex flex-col text-white dark:text-black items-start w-1/2`}>
            <span className="font-light">Price:</span>
            <span className="text-xl font-semibold">
              <BrokenPrice
                home={home}
                newCurrencySymbol={defaultCurrency.symbol}
                newCurrencyUsdPrice={defaultCurrency.usdPrice}
                reveal={user ? true : false}
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
                  reveal={user ? true : false}
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
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => {
            setContactModalOpen(true);
          }}
        >
          Contact the Owner
        </Button>
      </CardHeader>
      {/* Modal for showing owner details */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="max-w-[85vw] sm:max-w-3xl rounded-md" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Property Owner Contact Information</DialogTitle>
            <DialogClose asChild></DialogClose>
          </DialogHeader>
          <div className="max-h-[85vh] overflow-y-auto grid grid-cols-1 gap-4 p-4"></div>
        </DialogContent>
      </Dialog>
    </>
  );
}
