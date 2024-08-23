import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeType } from "@/lib/validations";
import { formatPrice, getFlagEmoji } from "@/lib/utils";
import { useContext, useEffect } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { useState } from "react";
import Link from "next/link";
import lookup from "country-code-lookup";

interface Props {
  home: HomeType | null;
  isLoading?: boolean;
}

export default function ResizableCard({ home, isLoading }: Props) {
  const { defaultCurrency } = useContext(LocaleContext);
  const [titleUnderlined, setTitleUnderlined] = useState(false);
  const [lang, setLang] = useState("");

  useEffect(() => {
    if (home && home.language) {
      setLang(home.language);
    }
  }, [home]);

  return !home || isLoading ? (
    <div className="flex flex-col h-full w-full space-y-2">
      <Skeleton className="rounded-none rounded-t-xl h-40 w-full" />
      <div className="flex flex-col justify-center items-center w-full gap-3 px-2 pb-3">
        <Skeleton className="h-4 sm:h-5 lg:h-6 w-32" />
        <Skeleton className="h-4 sm:h-4 lg:h-4 w-24" />
        <Skeleton className="h-3 sm:h-3 lg:h-4 w-24" />
        <Skeleton className="h-3 sm:h-3 lg:h-4 w-28" />
        <Skeleton className="h-4 sm:h-5 lg:h-6 w-36 font-semibold" />
      </div>
    </div>
  ) : (
    <div
      className="flex flex-col h-full w-full space-y-2"
      onMouseOver={() => {
        setTitleUnderlined(true);
      }}
      onMouseLeave={() => {
        setTitleUnderlined(false);
      }}
    >
      <Carousel className="h-full w-full">
        <CarouselContent>
          {home.photos.map((photo: string, index) => (
            <CarouselItem key={index} className="flex justify-center items-center h-full w-full">
              <div className="relative justify-center items-center h-[200px] w-full">
                <Image
                  src={photo}
                  className="object-cover object-center rounded-t-lg"
                  alt={`${home.title} photo ${index}`}
                  fill
                  sizes="(max-width: 500px) 100vw, (max-height: 500px) 100vh"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex absolute left-6 size-8" />
        <CarouselNext className="hidden sm:flex absolute right-6 size-8" />
      </Carousel>
      <Link href={`/homes/${home.id}`}>
        <div className="flex flex-col justify-center items-center w-full gap-2 px-2">
          <div className={`w-full flex ${home.title && home.title.length > 20 ? "justify-start" : "justify-center"}`}>
            <h2
              className={`text-sm md:text-md lg:text-lg xl:text-xl font-semibold overflow-hidden whitespace-nowrap text-ellipsis ${
                titleUnderlined && "underline"
              }`}
              lang={lang}
            >
              {home.title}
            </h2>
          </div>

          <div lang={lang} className="flex text-center text-xs sm:text-sm lg:text-md">
            {home.municipality}
          </div>
          <div lang={lang} className="flex text-center text-xs sm:text-sm lg:text-md">
            {home.region}
          </div>
          <div className="flex text-center text-sm sm:text-sm lg:text-md">
            {home.country && lookup.byIso(home.country)?.country}{" "}
            {home.country && getFlagEmoji(lookup.byIso(home.country)?.iso2 || "")}
          </div>
          <div className="flex text-center text-sm md:text-md lg:text-lg font-semibold mb-2">
            {formatPrice(defaultCurrency.symbol, home.priceUsd * defaultCurrency.usdPrice)}
          </div>
        </div>
      </Link>
    </div>
  );
}
