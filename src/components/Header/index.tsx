"use client";

import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";
import { poppins } from "@/app/[locale]/fonts";
import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useContext } from "react";
import SearchBox from "@/components/SearchBox";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons/icons";
import { useRouter } from "next/navigation";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { I18nProviderClient } from "@/locales/client";
import { ChevronLeft, HousePlus, Heart, Map, Gauge, ChartNoAxesCombined, ChartPie } from "lucide-react";
import SearchDialog from "@/components/SearchDialog";

interface Props {
  map: string;
  list: string;
  articles: string;
  data: string;
  searchPlaceholder: string;
  searchPlaceholderShort: string;
  searchText: string;
  construction: string;
  construction_sub: string;
  sellButtonBig: string;
  sellButtonSmall: string;
  exit: string;
  exit_short: string;
  searchButtonSmall: string;
}

export default function Header({
  map,
  list,
  articles,
  data,
  searchPlaceholder,
  searchPlaceholderShort,
  searchText,
  construction,
  construction_sub,
  sellButtonBig,
  sellButtonSmall,
  exit,
  exit_short,
  searchButtonSmall,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentHome, openLogInModal, openSignUpModal } = useContext(QueryContext);
  const { defaultLanguage, user } = useContext(LocaleContext);
  const isSearchPage = pathname.includes("/search");
  const isRootPage = pathname === "/";
  const isHomesPage = pathname.includes("/homes");
  const isSellPage = pathname.includes("/sell");
  const isArticlesPage = pathname.includes("/articles");
  const isStudioPage = pathname.includes("/studio");
  const isSingleListPage = pathname.includes("/my-wishlists/");
  const isDataPage = pathname.includes("/data");

  return (
    <>
      <header
        className={`sticky top-0 ${isStudioPage ? "hidden" : "flex"} ${
          isSellPage ? "justify-end" : "justify-center shadow-lg dark:shadow-white/5 xs:justify-between"
        } items-center h-[86px] z-[40] px-4 bg-background`}
      >
        {!isSellPage && (
          <div className={`${isSearchPage ? "flex" : "flex w-1/3 md:flex gap-2 md:gap-5"}`}>
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
                    isSearchPage ? "hidden 2xl:flex" : "hidden sm:flex"
                  } text-lg pr-2 font-medium align-middle`}
                >
                  Viva Ideal
                </h1>
              </div>
            </Button>
            {(isRootPage || isArticlesPage || isDataPage) && (
              <Button
                asChild
                size={"largeIcon"}
                variant="outline"
                className={`${isArticlesPage && "bg-secondary"} flex h-12 text-[#2dac5c] hover:text-primary/80 `}
                disabled={true}
              >
                <Link href="/articles">
                  <div className="flex px-2 justify-center text-center items-center gap-2">
                    <div className="flex justify-center items-center">
                      <Icons.book_icon width={"22"} height={"22"} />
                    </div>
                    <h1 className={`${poppins.className} hidden xs:flex md:text-inline align-middle font-medium`}>
                      {articles}
                    </h1>
                  </div>
                </Link>
              </Button>
            )}
            {isDataPage && (
              <Button
                asChild
                size={"largeIcon"}
                variant="outline"
                className="flex h-12 text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group"
                disabled={true}
              >
                <Link href="/data">
                  <div className="flex px-2 justify-center text-center items-center gap-2">
                    <div className="flex justify-center items-center">
                      <ChartPie width={"22"} height={"22"} />
                    </div>
                    <h1 className={`${poppins.className} hidden xs:flex md:text-inline align-middle font-medium`}>
                      {data}
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
            {isSingleListPage && (
              <Button
                asChild
                size={"largeIcon"}
                variant={"outline"}
                className="flex h-12 text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group"
                disabled={true}
              >
                <Link href={`/my-wishlists`}>
                  <div>
                    <div className="flex px-2 justify-center text-center items-center">
                      <div className="flex justify-between items-center gap-2">
                        <Heart width={"22"} height={"22"} />
                        <ChevronLeft width={"22"} height={"22"} />
                      </div>
                      <h1 className={`${poppins.className} hidden xs:flex md:text-inline align-middle font-medium`}>
                        {list}
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

        {!isSearchPage && !isSellPage && (
          <h1 className="hidden lg:flex flex-col justify-center flex-grow items-center text-center pb-8 pt-8 p-8">
            <span className="text-sm md:text-lg">{construction}</span>
            <span className="text-xs md:text-md">{construction_sub}</span>
          </h1>
        )}
        {!isSellPage && (
          <div className={`flex ${!isSearchPage && "w-1/3 flex-grow md:flex-grow-0"} gap-2 md:gap-5 justify-end`}>
            {!isSearchPage && (
              <Button
                className="flex h-12 gap-2 items-center text-sm font-medium"
                onClick={() => {
                  user ? router.push("/sell") : openSignUpModal();
                }}
              >
                <HousePlus width={22} height={22} strokeWidth={2} />
                <span className="hidden xs:flex md:hidden">{sellButtonSmall}</span>
                <span className="hidden md:inline">{sellButtonBig}</span>
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

      {/* <div className="flex relative z-100">
        <I18nProviderClient locale={defaultLanguage}>
          <ModalPortal>
            <Modal />
          </ModalPortal>
        </I18nProviderClient>
      </div> */}
    </>
  );
}
