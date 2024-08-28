"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HomeType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { EyeOpenIcon, EyeClosedIcon, CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import BrokenPrice from "@/components/BrokenPrice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Phone, PhoneCall } from "lucide-react";
import { handleCopy } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  home: HomeType;
  contactNameText: string;
  contactEmailText: string;
  contactPhoneText: string;
  mobilePrice: string;
  contactTitleMobile: string;
  contactButton: string;
}

export default function StickyPrice({
  home,
  contactNameText,
  contactEmailText,
  contactPhoneText,
  mobilePrice,
  contactTitleMobile,
  contactButton,
}: Props) {
  const { defaultCurrency, currencies } = useContext(LocaleContext);
  const { openLogInModal, isModalOpen, revealPrice, setRevealPrice, user, session } = useContext(QueryContext);
  const originalCurrencyRate = currencies.find((c) => home.currency === c.symbol)?.usdPrice ?? null;
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [revealContact, setRevealContact] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  return (
    <>
      <CardHeader className={`flex flex-col gap-y-2 items-center bg-card`}>
        <div className="flex flex-row items-end justify-between w-full">
          <div className={`flex flex-col items-start w-1/2`}>
            <span className="font-sm">Price:</span>
            <span className="text-xl font-semibold text-primary">
              <BrokenPrice
                home={home}
                newCurrencySymbol={defaultCurrency.symbol}
                newCurrencyUsdPrice={defaultCurrency.usdPrice}
                reveal={user ? true : false}
                blurAmount="blur-sm"
                className="mb-0"
              />
            </span>
          </div>
          <div className={`flex flex-col w-1/2 h-full text-end `}>
            <span className="text-sm">Original price ({home.currency})</span>
            <span className="flex justify-end gap-2 text-lg font-semibold text-primary">
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
          </div>
        </div>
        {session.status === "loading" ? (
          <Skeleton className="w-full h-9 md:h-10 lg:h-12" />
        ) : (
          <div className="flex w-full justify-center gap-4">
            {!user && (
              <Button
                onClick={() => {
                  user ? setRevealPrice(!revealPrice) : openLogInModal();
                }}
                variant={"default"}
                className="flex w-1/2 px-4 justify-center gap-2 text-center"
              >
                <div className="flex justify-center">
                  {revealPrice || isModalOpen ? (
                    <EyeOpenIcon className="w-4 h-4" />
                  ) : (
                    <EyeClosedIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="text-xs xs:text-sm">{mobilePrice}</div>
              </Button>
            )}
            <Button
              className={`flex ${user ? "w-full" : "w-1/2"} px-4 justify-center gap-2 text-center`}
              variant={"default"}
              onClick={() => {
                setContactModalOpen(true);
              }}
            >
              <div className="flex justify-center">
                {contactModalOpen ? <PhoneCall className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              </div>
              <div className="text-xs xs:text-sm">{contactButton}</div>
            </Button>
          </div>
        )}
      </CardHeader>
      {/* Modal for showing owner details */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="max-w-[85vw] sm:max-w-3xl rounded-md" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{contactTitleMobile}</DialogTitle>
            <DialogClose asChild></DialogClose>
          </DialogHeader>
          <div className="max-h-[85vh] overflow-y-auto grid grid-cols-1 gap-4 p-4">
            <div className="flex flex-col items-start">
              <span className="text-start text-xs md:text-sm">{contactNameText}</span>
              <div
                className={`flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
              >
                <div className="text-start">{home.contactName}</div>
                <Button
                  onClick={() => home.contactName && handleCopy(home.contactName, "name", setCopiedField)}
                  variant="outline"
                  size="icon"
                  className="flex text-xs gap-2 p-2"
                >
                  {copiedField === "name" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-start">
              <span className="text-start text-xs md:text-sm">{contactEmailText}</span>
              <div
                className={`flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
              >
                <div className="justify-start truncate">{home.contactEmail}</div>
                <Button
                  onClick={() => home.contactEmail && handleCopy(home.contactEmail, "email", setCopiedField)}
                  variant="outline"
                  size="icon"
                  className="flex text-xs gap-2 p-2"
                >
                  {copiedField === "email" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-start">
              <span className="text-start text-xs md:text-sm">{contactPhoneText}</span>
              <div
                className={`flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
              >
                <div className="justify-start">{home.contactPhone}</div>
                <Button
                  onClick={() => home.contactPhone && handleCopy(home.contactPhone, "phone", setCopiedField)}
                  variant="outline"
                  className="flex text-xs gap-2 p-2"
                  size="icon"
                >
                  {copiedField === "phone" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
