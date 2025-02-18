"use client";

import { CardHeader } from "@/components/ui/card";
import { HomeType } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { EyeOpenIcon, EyeClosedIcon, CheckIcon, CopyIcon, ReloadIcon } from "@radix-ui/react-icons";
import BrokenPrice from "@/components/BrokenPrice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Phone, PhoneCall } from "lucide-react";
import { handleCopy } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeContext } from "@/context/HomeContext";
import BuyNowButton from "@/components/BuyNowButton";
import PriceDialog from "@/components/HomeText/PriceDialog";
import ContactDialog from "@/components/HomeText/ContactDialog";

interface Props {
  contactNameText: string;
  contactEmailText: string;
  contactPhoneText: string;
  mobilePrice: string;
  contactTitleMobile: string;
  contactButton: string;
  contactThanks: string;
  buyNow: string;
  loginToPurchase: string;
  priceTitle: string;
  originalPrice: string;
  negotiable: string;
}

export default function StickyPrice({
  contactNameText,
  contactEmailText,
  contactPhoneText,
  mobilePrice,
  contactTitleMobile,
  contactButton,
  contactThanks,
  buyNow,
  loginToPurchase,
  priceTitle,
  originalPrice,
  negotiable,
}: Props) {
  const { home, editMode, homeOwnerEmail, homeOwnerName, homeOwnerPhone, fetchingContactInfo, handleGetContactInfo } =
    useContext(HomeContext);
  const { defaultCurrency, currencyData, sessionLoading, user } = useContext(LocaleContext);
  const { openLogInModal, isModalOpen, revealPrice, setRevealPrice, revealContact } = useContext(QueryContext);
  const originalCurrencyRate = currencyData?.prices.find((c) => home.currency === c.symbol)?.usdPrice ?? null;
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleContactButton = () => {
    handleGetContactInfo();
    setContactModalOpen(true);
  };

  return (
    <>
      <CardHeader className={`flex flex-col gap-y-2 items-center bg-card`}>
        {editMode ? (
          <PriceDialog
            priceTitle={priceTitle}
            originalPrice={originalPrice}
            originalCurrencyRate={originalCurrencyRate}
            buyNow={buyNow}
            negotiable={negotiable}
            loginToPurchase={loginToPurchase}
            contactThanks={contactThanks}
            revealPrice={revealPrice}
            isModalOpen={isModalOpen}
            isLargeScreen={false}
          />
        ) : (
          <div className="flex flex-row items-end justify-between w-full">
            <div className={`flex flex-col items-start w-1/2`}>
              <span className="font-sm">
                {priceTitle} {home.priceNegotiable && <span className="text-sm">(Negotiable)</span>}
              </span>
              <span className="text-xl font-semibold text-primary">
                <BrokenPrice
                  originalPrice={home.price}
                  originalCurrencySymbol={home.currency!}
                  priceUsd={home.priceUsd}
                  currency={defaultCurrency}
                  reveal={user ? true : false}
                  blurAmount="blur-sm"
                  className="mb-0"
                />
              </span>
            </div>
            <div className={`flex flex-col w-1/2 h-full text-end `}>
              <span className="text-sm">
                {originalPrice} ({home.currency})
              </span>
              <span className="flex justify-end gap-2 text-lg font-semibold text-primary">
                {originalCurrencyRate && home.currency ? (
                  <BrokenPrice
                    originalPrice={home.price}
                    originalCurrencySymbol={home.currency}
                    priceUsd={home.priceUsd}
                    currency={{ symbol: home.currency, usdPrice: originalCurrencyRate }}
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
        )}
        {sessionLoading ? (
          <div className="flex gap-2 justify-center w-full">
            <Skeleton className="w-1/2 h-9 md:h-10 lg:h-12" />
            <Skeleton className="w-1/2 h-9 md:h-10 lg:h-12" />
          </div>
        ) : (
          <div className="flex w-full justify-center gap-2">
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
            {editMode ? (
              <ContactDialog isLargeScreen={false} contactButton={contactButton} />
            ) : (
              <Button
                className={`flex ${user ? "w-full" : "w-1/2"} px-4 justify-center gap-2 text-center`}
                variant={"default"}
                onClick={() => {
                  user ? handleContactButton() : openLogInModal();
                }}
              >
                <div className="flex justify-center">
                  {contactModalOpen ? <PhoneCall className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </div>
                <div className="text-xs xs:text-sm">{contactButton}</div>
              </Button>
            )}
            {user && (
              <BuyNowButton
                homeId={home.id}
                user={user}
                buyNow={buyNow}
                loginToPurchase={loginToPurchase}
                contactThanks={contactThanks}
              />
            )}
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
          {fetchingContactInfo ? (
            <div className="flex justify-center items-center w-full">
              <ReloadIcon className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="max-h-[85vh] overflow-y-auto grid grid-cols-1 gap-4 p-4">
              <div className="flex flex-col items-start">
                <span className="text-start text-xs md:text-sm">{contactNameText}</span>
                <div
                  className={`flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                >
                  <div className="text-start">{homeOwnerName}</div>
                  <Button
                    onClick={() => homeOwnerName && handleCopy(homeOwnerName, "name", setCopiedField)}
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
                  <div className="justify-start truncate">{homeOwnerEmail}</div>
                  <Button
                    onClick={() => homeOwnerEmail && handleCopy(homeOwnerEmail, "email", setCopiedField)}
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
                  <div className="justify-start">{homeOwnerPhone}</div>
                  <Button
                    onClick={() => homeOwnerPhone && handleCopy(homeOwnerPhone, "phone", setCopiedField)}
                    variant="outline"
                    className="flex text-xs gap-2 p-2"
                    size="icon"
                  >
                    {copiedField === "phone" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
