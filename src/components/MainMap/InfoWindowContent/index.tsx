import { useState, memo, useMemo } from "react";
import { Feature, Point } from "geojson";
import { HomeFeatureProps } from "@/lib/validations";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BrokenPrice from "@/components/BrokenPrice";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import { User } from "next-auth";
import { CurrencyType } from "@/lib/validations";
import lookup from "country-code-lookup";
import { findMatching } from "@/lib/utils";

type InfowindowContentProps = {
  features: Feature<Point>[];
  otherCategories: string;
  typesObject: { id: string; name: string; translation: string }[];
  user?: User;
  defaultCurrency?: CurrencyType;
  loginToViewPrice: string;
};

const InfoWindowContent = memo(
  ({ features, otherCategories, typesObject, user, defaultCurrency, loginToViewPrice }: InfowindowContentProps) => {
    const [hovering, setHovering] = useState(false);

    const typeCount = useMemo(() => {
      if (features.length === 1) return null;
      return features.reduce(
        (acc, feature) => {
          const props = feature.properties as HomeFeatureProps;
          props.type.forEach((type) => {
            acc[type] = (acc[type] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>
      );
    }, [features]);

    if (features.length === 1) {
      const f = features[0];
      const props = f.properties! as HomeFeatureProps;
      return (
        <>
          <div className="flex flex-col justify-center items-center w-full min-w-[220px] text-sm">
            <Carousel
              className={`h-full w-full overflow-auto ${props.listingType === "premium" && "bg-gradient-to-r from-amber-400 dark:from-amber-500 via-yellow-400 dark:via-yellow-500 to-amber-400 dark:to-amber-500"}`}
            >
              <CarouselContent className="ml-0">
                {props.photos.map((photo: string, index) => (
                  <CarouselItem key={index} className="h-full w-full pl-0">
                    <div className={`relative justify-center items-center h-[150px] w-full`}>
                      <Link
                        href={getDetailsUrl(f.id)}
                        target={"_blank"}
                        className="w-full"
                        onMouseOver={() => setHovering(true)}
                      >
                        <Image
                          src={photo}
                          className={`object-cover object-center`}
                          alt={`${props.type} photo ${index}`}
                          fill={true}
                          loading={"lazy"}
                          placeholder={"blur"}
                          blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUW+ylBgADBQErtZO4YAAAAABJRU5ErkJggg=="
                          sizes="
                        (max-width: 400px) 400px,
                        (max-width: 510px) 510px,
                        (max-width: 768px) 768px, 
                        (max-width: 1024px) 1024px, 
                        (max-width: 1280px) 1280px, 
                        (max-width: 1536px) 1536px,
                        (max-width: 1920px) 1920px,
                        100vw"
                        />
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className={`${hovering ? "flex" : "hidden"} absolute left-6 size-8`} />
              <CarouselNext className={`${hovering ? "flex" : "hidden"} absolute right-6 size-8 border-2`} />
            </Carousel>
          </div>
          <Link href={`/homes/${props.id}`} target={"_blank"}>
            <div
              className={`flex items-center gap-3 py-2 px-3 ${props.listingType === "premium" && "bg-gradient-to-r from-amber-400 dark:from-amber-500 via-yellow-400 dark:via-yellow-500 to-amber-400 dark:to-amber-500"}`}
            >
              {props.country && (
                <FlagComponent
                  width={"w-12"}
                  height={"h-8"}
                  country={lookup.byIso(props.country)?.iso2 as Country}
                  countryName={props.country}
                />
              )}
              <div
                className={`flex flex-col justify-between ${props.listingType === "premium" && "text-white dark:text-black"}`}
              >
                {(() => {
                  console.log(typesObject);
                  console.log(props.type);
                  const matchingTypes = findMatching(typesObject, props, "type");
                  console.log(matchingTypes);
                  return (
                    <span className={`font-medium text-sm`}>
                      {matchingTypes[0].translation}
                      {matchingTypes.length > 1 && ` (+${new Intl.NumberFormat().format(matchingTypes.length - 1)})`}
                    </span>
                  );
                })()}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <BrokenPrice
                        priceUsd={props.priceUsd}
                        currency={defaultCurrency!}
                        reveal={user ? true : false}
                        blurAmount="blur-sm"
                        className={`text-lg hover:cursor-pointer font-light`}
                      />
                    </TooltipTrigger>
                    {!user && (
                      <TooltipContent className="flex justify-center items-center">
                        <p>{loginToViewPrice}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </Link>
        </>
      );
    } else {
      return (
        <div className={`text-sm flex flex-col pb-3 pl-3`}>
          <ul>
            {typeCount &&
              Object.entries(typeCount)
                .slice(0, 5)
                .map(([type, count]) => (
                  <li key={type}>
                    {new Intl.NumberFormat().format(count)} {typesObject.find((t) => t.name === type)?.translation}
                  </li>
                ))}
          </ul>
          {typeCount && Object.entries(typeCount).length > 5 && (
            <div>
              {Object.entries(typeCount).length - 5} {otherCategories}
            </div>
          )}
        </div>
      );
    }
  }
);

InfoWindowContent.displayName = "InfoWindowContent";
export { InfoWindowContent };

function getDetailsUrl(id: string | number | undefined) {
  return `/homes/${id}`;
  // return props.wikipedia ? getWikipediaUrl(props.wikipedia) : getWikidataUrl(props.wikidata);
}
