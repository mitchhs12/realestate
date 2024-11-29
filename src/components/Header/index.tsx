"use client";

import Link from "next/link";
import ProfileButton from "@/components/Header/ProfileButton";
import { poppins } from "@/app/[locale]/fonts";
import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useContext, useState } from "react";
import SearchBox from "@/components/SearchBox";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons/icons";
import { useRouter } from "next/navigation";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { I18nProviderClient } from "@/locales/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  HousePlus,
  Heart,
  Map,
  Gauge,
  ChartNoAxesCombined,
  ChartPie,
  ChartLine,
  BarChart,
  ChartColumn,
  ChartColumnBig,
  BookText,
  CircleHelp,
  Info,
  Contact,
  Tags,
  Compass,
} from "lucide-react";
import SearchDialog from "@/components/SearchDialog";

interface Props {
  map: string;
  menu: string;
  about: string;
  articles: string;
  data: string;
  explore: string;
  pricing: string;
  searchPlaceholder: string;
  searchPlaceholderShort: string;
  searchText: string;
  sellButtonBig: string;
  sellButtonSmall: string;
  exit: string;
  exit_short: string;
  searchButtonSmall: string;
}

export default function Header({
  map,
  menu,
  about,
  articles,
  data,
  explore,
  pricing,
  searchPlaceholder,
  searchPlaceholderShort,
  searchText,
  sellButtonBig,
  sellButtonSmall,
  exit,
  exit_short,
  searchButtonSmall,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentHome, openLogInModal, openSignUpModal } = useContext(QueryContext);
  const { defaultLanguage, user, sessionLoading } = useContext(LocaleContext);
  const isRootPage = pathname === "/" || pathname === `/${defaultLanguage}`;
  const isAboutPage = pathname.includes("/about");
  const isArticlesPage = pathname.includes("/articles");
  const isDataPage = pathname.includes("/data");
  const isHomesPage = pathname.includes("/homes");
  const isSearchPage = pathname.includes("/search");
  const isSellPage = pathname.includes("/sell");
  const isPricingPage = pathname.includes("/pricing");
  const isStudioPage = pathname.includes("/studio");
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const getCurrentPage = () => {
    if (isRootPage) return "home";
    if (isAboutPage) return "about";
    if (isArticlesPage) return "articles";
    if (isDataPage) return "data";
    if (isSearchPage) return "search";
    if (isSellPage) return "sell";
    if (isPricingPage) return "pricing";
  };

  return (
    <>
      <header
        className={`sticky top-0 ${isStudioPage ? "hidden" : "flex"} ${
          isSellPage ? "justify-end" : "justify-center shadow-lg dark:shadow-white/5 xs:justify-between"
        } items-center h-[86px] z-[40] p-2 px-4 sm:p-4 md:px-6 bg-background`}
      >
        {!isSellPage && (
          <div className={`${isSearchPage ? "flex" : "flex md:flex gap-2 2xs:gap-4 md:gap-4 lg:gap-5"}`}>
            {!isSearchPage && (
              <div className="hidden lg:inline">
                <Button
                  size={"largeIcon"}
                  variant="outline"
                  className={`flex ${isRootPage && "bg-secondary"} h-12 text-[#2dac5c] hover:text-primary/80 group`}
                  onClick={() => {
                    isRootPage ? router.refresh() : router.push("/");
                  }}
                >
                  <div className="flex px-1 justify-center items-center gap-1">
                    <div className="flex justify-center items-center">
                      {!isStudioPage && <Logo width={"40"} height={"40"} />}
                    </div>
                    <h1
                      className={`${poppins.className} ${
                        isSearchPage ? "hidden 2xl:flex" : "hidden md:flex"
                      } items-center text-lg font-medium align-middle`}
                    >
                      Viva Ideal
                    </h1>
                  </div>
                </Button>
              </div>
            )}
            <div className={`${!isSearchPage && "flex lg:hidden"}`}>
              <DropdownMenu open={dropDownOpen} onOpenChange={setDropDownOpen} modal={false}>
                <DropdownMenuTrigger>
                  <Button
                    size={"largeIcon"}
                    variant={"outline"}
                    className={`flex ${isRootPage && "lg:bg-secondary"} h-12 text-[#2dac5c] hover:text-primary/80 group`}
                  >
                    <div className="flex px-1 justify-center items-center gap-1">
                      <div className="flex justify-center items-center">
                        {!isStudioPage && <Logo width={"40"} height={"40"} />}
                      </div>
                      <h1 className={`flex items-center text-lg font-medium align-middle`}>{menu}</h1>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={"bottom"} align={"start"} className="text-[#2dac5c]">
                  <Link
                    href={"/"}
                    passHref
                    onClick={() => {
                      setDropDownOpen(false);
                    }}
                  >
                    <DropdownMenuLabel className={`flex items-center text-[#2dac5c] gap-1`}>
                      <Logo width={"40"} height={"40"} />
                      Viva Ideal
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </Link>
                  {isRootPage ? (
                    <DropdownMenuGroup className="flex flex-col gap-3 py-2">
                      <Link href={"/about"} passHref>
                        <DropdownMenuItem className="flex gap-[12.5px] items-center font-medium">
                          <div className="pl-[7px]">
                            <Contact />
                          </div>
                          <div className="w-full">{about}</div>
                        </DropdownMenuItem>
                      </Link>
                      <Link href={"/articles"} passHref>
                        <DropdownMenuItem className="flex gap-[12.5px] items-center font-medium">
                          <div className="pl-[7px]">
                            <BookText />
                          </div>
                          <span>{articles}</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href={"/data"} passHref>
                        <DropdownMenuItem disabled={true} className="flex gap-[12.5px] items-center font-medium">
                          <div className="pl-[7px]">
                            <ChartColumn />
                          </div>
                          <span>{data}</span>
                        </DropdownMenuItem>
                      </Link>
                      {/* <Link href={"/explore"} passHref> */}
                      <DropdownMenuItem disabled={true} className="flex gap-[12.5px] items-center font-medium">
                        <div className="pl-[7px]">
                          <Compass />
                        </div>
                        <span>{explore}</span>
                      </DropdownMenuItem>
                      {/* </Link> */}
                      <Link href={"/pricing"} passHref>
                        <DropdownMenuItem className="flex gap-[12.5px] items-center font-medium">
                          <div className="pl-[7px]">
                            <Tags />
                          </div>
                          <span>{pricing}</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                  ) : (
                    <DropdownMenuRadioGroup value={getCurrentPage()} className="flex flex-col gap-3 py-2">
                      <Link href={"/about"} passHref>
                        <DropdownMenuRadioItem value={"about"} className="flex gap-3 items-center font-medium">
                          <Contact />
                          <span>{about}</span>
                        </DropdownMenuRadioItem>
                      </Link>
                      <Link href={"/articles"} passHref>
                        <DropdownMenuRadioItem value={"articles"} className="flex gap-3 items-center font-medium">
                          <BookText />
                          <span>{articles}</span>
                        </DropdownMenuRadioItem>
                      </Link>
                      <Link href={"/data"} passHref>
                        <DropdownMenuRadioItem
                          disabled={true}
                          value={"data"}
                          className="flex gap-3 items-center font-medium"
                        >
                          <ChartColumn />
                          <span>{data}</span>
                        </DropdownMenuRadioItem>
                      </Link>
                      {/* <Link href={"/explore"} passHref> */}
                      <DropdownMenuRadioItem
                        disabled={true}
                        value={"explore"}
                        className="flex gap-3 items-center font-medium"
                      >
                        <Compass />
                        <span>{explore}</span>
                      </DropdownMenuRadioItem>
                      {/* </Link> */}
                      <Link href={"/pricing"} passHref>
                        <DropdownMenuRadioItem value={"pricing"} className="flex gap-3 items-center font-medium">
                          <Tags />
                          <span>{pricing}</span>
                        </DropdownMenuRadioItem>
                      </Link>
                    </DropdownMenuRadioGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {!isSearchPage && !isHomesPage && (
              <Button
                asChild
                size={"largeIcon"}
                variant="outline"
                className={`hidden lg:flex ${isAboutPage && "bg-secondary"} h-12 text-[#2dac5c] hover:text-primary/80 `}
                disabled={true}
              >
                <Link href="/about">
                  <div className="flex px-2 justify-center text-center items-center gap-2">
                    <div className="flex justify-center items-center">
                      <Contact width={"22"} height={"22"} />
                    </div>
                    <h1 className={`${poppins.className} hidden sm:flex md:text-inline align-middle font-medium`}>
                      {about}
                    </h1>
                  </div>
                </Link>
              </Button>
            )}

            {!isSearchPage && !isHomesPage && (
              <Button
                asChild
                size={"largeIcon"}
                variant="outline"
                className={`hidden lg:flex ${isArticlesPage && "bg-secondary"} h-12 text-[#2dac5c] hover:text-primary/80 `}
                disabled={true}
              >
                <Link href="/articles">
                  <div className="flex px-2 justify-center text-center items-center gap-2">
                    <div className="flex justify-center items-center">
                      <BookText width={"22"} height={"22"} />
                    </div>
                    <h1 className={`${poppins.className} hidden sm:flex md:text-inline align-middle font-medium`}>
                      {articles}
                    </h1>
                  </div>
                </Link>
              </Button>
            )}

            {!isSearchPage && !isHomesPage && (
              <Button
                size={"largeIcon"}
                variant="outline"
                className={`hidden lg:flex ${isDataPage && "bg-secondary"} h-12 text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group`}
                disabled={true}
              >
                {/* <Link href="/data"> */}
                <div className="flex px-2 justify-center text-center items-center gap-2">
                  <div className="flex justify-center items-center">
                    <ChartColumn width={"22"} height={"22"} strokeWidth={2} />
                  </div>
                  <h1 className={`${poppins.className} hidden xs:flex md:text-inline align-middle font-medium`}>
                    {data}
                  </h1>
                </div>
                {/* </Link> */}
              </Button>
            )}

            {!isSearchPage && !isHomesPage && (
              <Button
                asChild
                size={"largeIcon"}
                variant="outline"
                className={`hidden lg:flex ${isPricingPage && "bg-secondary"} h-12 text-[#2dac5c] hover:text-primary/80 `}
                disabled={true}
              >
                <Link href="/pricing">
                  <div className="flex px-2 justify-center text-center items-center gap-2">
                    <div className="flex justify-center items-center">
                      <Tags width={"22"} height={"22"} />
                    </div>
                    <h1 className={`${poppins.className} hidden sm:flex md:text-inline align-middle font-medium`}>
                      {pricing}
                    </h1>
                  </div>
                </Link>
              </Button>
            )}

            {isHomesPage && (
              <Button
                asChild
                size={"largeIcon"}
                variant={"outline"}
                className="flex h-12 text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group"
                disabled={true}
              >
                <Link href={`/search/home-${currentHome?.id}`}>
                  <div>
                    <div className="flex px-2 justify-center text-center items-center">
                      <div className="flex justify-between items-center gap-2">
                        <Map width={"22"} height={"22"} />
                        <ChevronLeft width={"22"} height={"22"} />
                      </div>
                      <h1 className={`${poppins.className} hidden xs:flex md:text-inline align-middle font-medium`}>
                        {map}
                      </h1>
                    </div>
                  </div>
                </Link>
              </Button>
            )}
          </div>
        )}
        {isSearchPage && (
          <>
            <div className="hidden sm:flex items-center justify-center gap-5 px-4 w-full max-w-5xl">
              <SearchBox
                rawBox={false}
                isSmallMap={false}
                placeholder={searchPlaceholder}
                placeholderShort={searchPlaceholderShort}
                text={searchText}
              />
            </div>
            <div className="flex sm:hidden items-center justify-center gap-5 w-full">
              <SearchDialog
                isSmallMap={false}
                placeholder={searchPlaceholder}
                placeholderShort={searchPlaceholderShort}
                text={searchButtonSmall}
              />
            </div>
          </>
        )}

        {/* {!isSearchPage && !isSellPage && (
          <h1 className="hidden lg:flex flex-col justify-center items-center text-center pb-8 pt-8 p-8">
            <span className="text-sm md:text-lg">{construction}</span>
            <span className="text-xs md:text-md">{construction_sub}</span>
          </h1>
        )} */}
        {!isSellPage && (
          <div className={`flex ${!isSearchPage && "flex-grow md:flex-grow-0"} gap-3 md:gap-4 lg:gap-5 justify-end`}>
            {!isSearchPage && (
              <Button
                disabled={sessionLoading}
                className="flex h-12 gap-2 items-center text-sm font-medium"
                onClick={() => {
                  user ? router.push("/sell") : openSignUpModal();
                }}
              >
                <HousePlus width={22} height={22} strokeWidth={2} />
                <span className="hidden xs:flex md:hidden lg:inline xl:hidden">{sellButtonSmall}</span>
                <span className="hidden md:inline lg:hidden xl:inline">{sellButtonBig}</span>
              </Button>
            )}
            <div className={`justify-between gap-3 items-center`}>
              <ProfileButton openSignUpModal={openSignUpModal} openLogInModal={openLogInModal} />
            </div>
          </div>
        )}
        {isSellPage && (
          <Button
            variant="outline"
            onClick={() => {
              router.push("/");
            }}
          >
            <span className="sm:hidden">{exit_short}</span>
            <span className="hidden sm:flex">{exit}</span>
          </Button>
        )}
      </header>

      <div className="flex relative z-100">
        <I18nProviderClient locale={defaultLanguage}>
          <ModalPortal>
            <Modal />
          </ModalPortal>
        </I18nProviderClient>
      </div>
    </>
  );
}
