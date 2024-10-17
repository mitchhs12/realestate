import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BrokenPrice from "@/components/BrokenPrice";
import Price from "@/app/[locale]/homes/[homeId]/edit/price";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircledIcon, CrossCircledIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useContext, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeContext } from "@/context/HomeContext";
import BuyNowButton from "@/components/BuyNowButton";
import { Button } from "@/components/ui/button";
import { I18nProviderClient } from "@/locales/client";

export default function PriceDialog({
  priceTitle,
  originalPrice,
  originalCurrencyRate,
  buyNow,
  loginToPurchase,
  contactThanks,
  negotiable,
  revealPrice,
  isModalOpen,
  hidePrice,
  showPrice,
  isLargeScreen,
}: {
  priceTitle: string;
  originalPrice: string;
  originalCurrencyRate: number | null;
  buyNow: string;
  loginToPurchase: string;
  contactThanks: string;
  negotiable: string;
  revealPrice: boolean;
  isModalOpen: boolean;
  hidePrice?: string;
  showPrice?: string;
  isLargeScreen: boolean;
}) {
  const { user, defaultCurrency, sessionLoading, sessionUnauthenticated, defaultLanguage } = useContext(LocaleContext);
  const { home } = useContext(HomeContext);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  return (
    <Dialog open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen}>
      <DialogTrigger asChild>
        <div className="w-full h-full hover:cursor-pointer border-2 p-2 border-primary animate-pulse rounded-md bg-primary/10">
          {isLargeScreen ? (
            <Card className="w-full max-w-xs shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm md:text-base lg:text-lg">{priceTitle}</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                {sessionLoading ? (
                  <div className="flex justify-center w-full">
                    <Skeleton className="h-8 md:h-9 lg:h-10 w-8/12" />
                  </div>
                ) : (
                  <BrokenPrice
                    priceUsd={home.priceUsd}
                    currency={defaultCurrency}
                    reveal={user ? true : false}
                    originalPrice={home.price}
                    originalCurrencySymbol={home.currency!}
                    blurAmount={"blur-lg"}
                    className="text-primary justify-center text-2xl md:text-3xl lg:text-4xl"
                  />
                )}
                <div className={`flex flex-col w-full`}>
                  <span className={`text-sm md:text-base lg:text-lg`}>
                    {originalPrice} ({home.currency})
                  </span>
                  {sessionLoading ? (
                    <div className="flex justify-center w-full">
                      <Skeleton className="items-center h-6 md:h-7 lg:h-7.5 w-7/12" />
                    </div>
                  ) : originalCurrencyRate && home.currency ? (
                    <BrokenPrice
                      priceUsd={home.priceUsd}
                      currency={{ symbol: home.currency, usdPrice: originalCurrencyRate }}
                      reveal={user ? true : false}
                      originalPrice={home.price}
                      originalCurrencySymbol={home.currency}
                      blurAmount={"blur-md"}
                      className="text-primary justify-center text-base md:text-lg lg:text-xl"
                    />
                  ) : (
                    "Contact us"
                  )}
                </div>
                <div className="flex flex-col items-center w-full gap-3">
                  <div className="flex items-center justify-center gap-2 w-full">
                    <span className="flex text-start font-medium text-xs md:text-sm lg:text-xl">{negotiable}</span>
                    <span className="flex text-center w-auto h-auto">
                      {home.priceNegotiable ? (
                        <span className="flex w-auto h-auto">
                          <CheckCircledIcon className="rounded-full text-primary w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                        </span>
                      ) : (
                        <span className="flex w-auto h-auto">
                          <CrossCircledIcon className="text-red-500 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                        </span>
                      )}
                    </span>
                  </div>

                  {sessionLoading ? (
                    <Skeleton className="h-[3.2vh] md:h-[3.2vh] lg:h-[2.8vh] xl:h-[2.8vh] w-11/12" />
                  ) : (
                    user &&
                    user.id && (
                      <BuyNowButton
                        homeId={home.id}
                        user={user}
                        buyNow={buyNow}
                        loginToPurchase={loginToPurchase}
                        contactThanks={contactThanks}
                      />
                    )
                  )}
                </div>
                {sessionLoading ||
                  (sessionUnauthenticated && (
                    <div className="flex items-center justify-center mt-4">
                      <Button
                        variant={"default"}
                        className="flex justify-center max-w-md text-center h-full w-[300px]" // Adjust the width as needed
                      >
                        <div className="flex gap-3 justify-center text-lg items-center">
                          {revealPrice || isModalOpen ? (
                            <EyeOpenIcon className="w-5 h-5" />
                          ) : (
                            <EyeClosedIcon className="w-5 h-5" />
                          )}
                          <span className="text-xs md:text-sm lg:text-base">{`${revealPrice ? hidePrice : showPrice}`}</span>
                        </div>
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
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
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] px-0 sm:px-2 md:px-6">
        <I18nProviderClient locale={defaultLanguage}>
          <Price />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
