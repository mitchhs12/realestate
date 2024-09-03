"use client";

import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";
import { poppins } from "@/app/[locale]/fonts";
import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useEffect, useState, useContext } from "react";
import SearchBox from "@/components/SearchBox";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons/icons";
import { useRouter } from "next/navigation";
import { useCurrentLocale } from "@/locales/client";
import { QueryContext } from "@/context/QueryContext";
import Filters from "@/components/Filters";
import { I18nProviderClient } from "@/locales/client";
import FiltersDialog from "@/components/FiltersDialog";

interface Props {
  articles: string;
  searchPlaceholder: string;
  searchText: string;
  construction: string;
  construction_sub: string;
  sellButtonBig: string;
  sellButtonSmall: string;
  greeting: string;
  log_in: string;
  sign_up: string;
  log_out: string;
  theme: { theme: string; light: string; dark: string; system: string };
  language: string;
  currency: string;
  settings: string;
  exit: string;
  exit_short: string;
  filters: string;
  myproperties: string;
  features: string;
  featuresSub: string;
  categories: string;
  categoriesSub: string;
  rooms: string;
  roomsSub: string;
  apply: string;
  reset: string;
  selectAll: string;
  deselectAll: string;
}

export default function Header({
  articles,
  searchPlaceholder,
  searchText,
  construction,
  construction_sub,
  sellButtonBig,
  sellButtonSmall,
  greeting,
  log_in,
  sign_up,
  log_out,
  theme,
  language,
  currency,
  settings,
  exit,
  exit_short,
  filters,
  myproperties,
  features,
  featuresSub,
  categories,
  categoriesSub,
  rooms,
  roomsSub,
  apply,
  reset,
  selectAll,
  deselectAll,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useCurrentLocale();
  const { currentHome, isSmallScreen, openLogInModal, openSignUpModal, user } = useContext(QueryContext);

  const isSearchPage = pathname.includes("/search/");
  const isSellPage = pathname.includes("/sell");
  const isGuidesPage = pathname.includes("/articles");
  const isStudioPage = pathname.includes("/studio");

  const [previousPath, setPreviousPath] = useState("");

  useEffect(() => {
    setPreviousPath(pathname);
  }, [pathname, router]);

  return (
    <>
      <header
        className={`sticky top-0 ${isStudioPage ? "hidden" : "flex"} ${
          isSellPage ? "justify-end" : "justify-center shadow-lg dark:shadow-white/5 xs:justify-between"
        } items-center h-[86px] z-[40] px-5 bg-background gap-5`}
      >
        {!isSellPage && (
          <div className={`${isSearchPage ? "hidden xs:flex" : "flex w-1/3 md:flex gap-5"}`}>
            <Button
              size={"largeIcon"}
              variant="outline"
              className={`flex h-12 text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group`}
              onClick={() => {
                pathname === "/"
                  ? router.refresh()
                  : pathname.includes("/homes")
                    ? currentHome
                      ? isSmallScreen
                        ? router.back()
                        : router.push("/")
                      : router.push("/")
                    : router.push("/");
              }}
            >
              <div className="flex px-1 justify-center items-center gap-1">
                <div className="flex justify-center items-center">
                  {!isStudioPage && <Logo width={"40"} height={"40"} />}
                </div>
                <h1
                  className={`${poppins.className} ${
                    isSearchPage ? "hidden 2xl:flex" : "hidden sm:flex"
                  } text-lg pr-2 font-normal align-middle`}
                >
                  Viva Ideal
                </h1>
              </div>
            </Button>
            {(pathname === "/" || pathname.includes("articles")) && (
              <Button
                asChild
                size={"largeIcon"}
                variant="outline"
                className="flex h-12 text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group"
                disabled={true}
              >
                <Link href="/articles">
                  <div className="flex px-2 justify-center text-center items-center gap-2">
                    <div className="flex justify-center items-center">
                      <Icons.book_icon width={"22"} height={"22"} />
                    </div>
                    <h1 className={`${poppins.className} hidden xs:flex md:text-inline align-middle`}>{articles}</h1>
                  </div>
                </Link>
              </Button>
            )}
          </div>
        )}
        {isSearchPage && (
          <div className="flex items-center justify-center gap-5 w-full max-w-5xl">
            <div className="flex flex-grow">
              <SearchBox isSmallMap={false} placeholder={searchPlaceholder} text={searchText} />
            </div>
            <div className="hidden sm:flex">
              <Filters
                filters={filters}
                locale={locale}
                categories={categories}
                categoriesSub={categoriesSub}
                features={features}
                featuresSub={featuresSub}
                rooms={rooms}
                roomsSub={roomsSub}
                apply={apply}
                reset={reset}
                selectAll={selectAll}
                deselectAll={deselectAll}
              />
            </div>
            <div className="flex sm:hidden">
              <FiltersDialog
                filters={filters}
                locale={locale}
                categories={categories}
                features={features}
                rooms={rooms}
                apply={apply}
                reset={reset}
                selectAll={selectAll}
                deselectAll={deselectAll}
              />
            </div>
          </div>
        )}

        {!isSearchPage && !isSellPage && (
          <h1 className="hidden lg:flex flex-col justify-center flex-grow items-center text-center pb-8 pt-8 p-8">
            <span className="text-sm md:text-lg">{construction}</span>
            <span className="text-xs md:text-md">{construction_sub}</span>
          </h1>
        )}
        {!isSellPage && (
          <div
            className={`flex ${!isSearchPage ? "w-1/3 flex-grow md:flex-grow-0" : "hidden xs:flex"} gap-5 justify-end`}
          >
            {!isSearchPage && (
              <Button
                className="flex h-12 gap-2 items-center"
                onClick={() => {
                  user ? router.push("/sell") : openSignUpModal();
                }}
              >
                <Icons.sell_home />
                <span className="flex md:hidden">{sellButtonSmall}</span>
                <span className="hidden md:inline">{sellButtonBig}</span>
              </Button>
            )}
            <div className={`justify-between gap-3 items-center`}>
              <ProfileButton
                openSignUpModal={openSignUpModal}
                openLogInModal={openLogInModal}
                greeting={greeting}
                log_in={log_in}
                sign_up={sign_up}
                log_out={log_out}
                theme={theme}
                language={language}
                currency={currency}
                settings={settings}
                myproperties={myproperties}
              />
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
        <I18nProviderClient locale={locale}>
          <ModalPortal>
            <Modal />
          </ModalPortal>
        </I18nProviderClient>
      </div>
    </>
  );
}
