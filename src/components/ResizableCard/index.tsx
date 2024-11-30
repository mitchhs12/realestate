"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeType, TypeObject } from "@/lib/validations";
import { useContext, useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import lookup from "country-code-lookup";
import ResizableCarousel from "@/components/ResizableCarousel";
import { LocaleContext } from "@/context/LocaleContext";
import BrokenPrice from "@/components/BrokenPrice";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import { Button } from "@/components/ui/button";
import { getCountryNameForLocale } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, EyeOff } from "lucide-react";
import { changeHomeVisibility } from "@/app/[locale]/my-properties/actions";
import { usePathname } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import MultiTypeButton from "../MultiTypeButton";
import { useTheme } from "next-themes";
import DeleteButton from "@/components/DeleteButton";

interface Props {
  home: HomeType | null;
  finishSelling?: string;
  incompleteListing?: string;
  isLoading?: boolean;
  types: TypeObject[];
  loginToViewPrice?: string;
  userId?: string;
  premiumText: string;
  deleting?: boolean;
  handleDelete?: (homeId: number) => void;
}

export default function ResizableCard({
  home,
  finishSelling,
  incompleteListing,
  isLoading,
  types,
  loginToViewPrice,
  premiumText,
}: Props) {
  const [titleUnderlined, setTitleUnderlined] = useState(false);
  const [lang, setLang] = useState("");
  const { user, defaultLanguage, defaultCurrency, sessionLoading } = useContext(LocaleContext);
  const [visibilityChanging, setVisibilityChanging] = useState(false);
  const path = usePathname();
  const isSell = path.includes("/sell");
  const isMyProperties = path === "/my-properties" || path === `/${defaultLanguage}/my-properties`;
  const [currentType, setCurrentType] = useState<TypeObject | null>(types[0]);
  console.log("currentType", currentType);
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    if (home && home.language) {
      setLang(home.language);
    }
    setVisibilityChanging(false);
  }, [home]);

  const iso = home && home.country && lookup.byIso(home.country);
  const countryName =
    iso && typeof iso !== "string"
      ? getCountryNameForLocale(iso.iso2, defaultLanguage || home.country || "")
      : home?.country;

  return !home || isLoading ? (
    <div className={`flex flex-col h-full w-full overflow-hidden`}>
      <Skeleton
        className={`rounded-2xl h-[250px] shadow-lg w-full ${home?.listingType === "premium" ? "shadow-yellow-500/40 dark:shadow-yellow-500/40" : "dark:shadow-white/20"}`}
      />
      <div className="h-[144px] flex flex-col justify-center items-start w-full gap-5 pl-4 px-2">
        <Skeleton className="h-5 sm:h-5 lg:h-6 w-32" />
        <Skeleton className="h-4 sm:h-3 lg:h-5 w-28" />
        <Skeleton className="h-4 sm:h-5 lg:h-6 w-36 font-semibold" />
      </div>
    </div>
  ) : (
    <div
      className={`flex flex-col h-full w-full relative`}
      onMouseOver={() => {
        setTitleUnderlined(true);
      }}
      onMouseLeave={() => {
        setTitleUnderlined(false);
      }}
    >
      {home.listingType === "premium" && (
        // comment style={{ paddingTop: "12px" }} above and add style={{ marginTop:'-12' }} below
        <div className="absolute" style={{ top: "0", left: "-12px", zIndex: 30, marginTop: "-12px" }}>
          <Link href={home.isComplete ? `/homes/${home.id}` : `/sell/${home.id}`} target={"_blank"}>
            <svg height="84" width="84">
              <g transform="rotate(-90, 42, 42)">
                <polygon points="0 0, 0 12, 12 12" fill={`${"rgb(180 83 9)"}`} />
                <polygon
                  points="0 0, 84 84, 84 48, 36 0"
                  fill={theme === "dark" ? "rgb(251 191 36)" : "rgb(252 211 77)"}
                />
                <polygon points="72 72, 72 84, 84 84" fill={`${"rgb(180 83 9)"}`} />
              </g>
            </svg>
            <span className="leftCornerRibbonText text-white font-bold">{premiumText}</span>
          </Link>
        </div>
      )}
      <div
        className={`flex flex-col w-full h-full overflow-hidden ${home.listingType === "premium" && "border-[3px] border-amber-500"} ${home?.listingType === "premium" ? "shadow-yellow-500/40 dark:shadow-yellow-500/40" : "dark:shadow-white/10"}`}
      >
        <ResizableCarousel
          photos={home.photos}
          title={home.title!}
          hovering={titleUnderlined}
          home={home}
          link={true}
        />
        <Link href={home.isComplete ? `/homes/${home.id}` : `/sell/${home.id}`} target={"_blank"}>
          <div className={`flex flex-col justify-center items-start w-full pt-2 gap-2 px-4 relative`}>
            <h3
              className={`text-md pl-11 pt-2.5 md:text-lg w-full font-semibold overflow-hidden whitespace-nowrap text-ellipsis text-start ${!home.isComplete && "text-red-500"} ${
                titleUnderlined && "underline"
              }`}
            >
              {home.isComplete
                ? types.length > 1
                  ? currentType?.translation
                  : types.length > 0 && types[0].translation
                : finishSelling}
            </h3>
            {home.municipality && home.country ? (
              <div className="flex items-center gap-3 pt-1.5">
                <div>
                  <FlagComponent
                    country={lookup.byIso(home.country)?.iso2 as Country}
                    countryName={home.country}
                    height={"h-[1.3125rem]"}
                    width={"w-[2rem]"}
                  />
                </div>
                <div lang={lang} className="flex flex-col w-full">
                  <text className="text-sm w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {home.municipality}
                  </text>
                  <text className="text-xs w-full overflow-hidden whitespace-nowrap text-ellipsis">{countryName}</text>
                </div>
              </div>
            ) : (
              <div>-</div>
            )}
            <div className="pt-1">
              {sessionLoading ? (
                <Skeleton className="h-[1.4rem] lg:h-7 w-28 mb-2" />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <BrokenPrice
                        incompleteListing={incompleteListing}
                        priceUsd={home.priceUsd}
                        originalPrice={home.price}
                        originalCurrencySymbol={home.currency!}
                        currency={defaultCurrency}
                        reveal={user ? true : false}
                        blurAmount="blur-sm"
                        className="text-sm md:text-md lg:text-lg mb-2"
                      />
                    </TooltipTrigger>
                    {!user && (
                      <TooltipContent>
                        <p>{loginToViewPrice}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {!incompleteListing && (
              <MultiTypeButton
                types={types}
                currentType={currentType}
                setCurrentType={setCurrentType}
                disabled={true}
                premium={home.listingType === "premium"}
              />
            )}
          </div>
        </Link>
      </div>

      {isMyProperties && home.isComplete && user?.id === home.ownerId && (
        <Button
          variant={home.isActive ? "default" : "destructive"}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            setVisibilityChanging(true);
            await changeHomeVisibility(home.id, home.isActive);
          }}
          size={"icon"}
          disabled={visibilityChanging}
          className="absolute bottom-2 right-2"
        >
          {!visibilityChanging ? home.isActive ? <Eye /> : <EyeOff /> : <ReloadIcon className="animate-spin w-5 h-5" />}
        </Button>
      )}
      {(isMyProperties || isSell) && user?.id === home.ownerId && <DeleteButton homeId={home.id} />}
    </div>
  );
}
