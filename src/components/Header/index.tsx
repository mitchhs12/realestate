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
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCurrentLocale } from "@/locales/client";
import { I18nProviderClient } from "@/locales/client";
import { ChevronLeft } from "lucide-react";
import { QueryContext } from "@/context/QueryContext";

interface Props {
  guides: string;
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
}

export default function Header({
  guides,
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
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useCurrentLocale();
  const {
    currentHome,
    isSmallScreen,
    openLogInModal,
    openSignUpModal,
    closeModal,
    isModalOpen,
    isLoginOpen,
    setIsLoginOpen,
    user,
  } = useContext(QueryContext);

  const isSearchPage = pathname.includes("/search/");
  const isSellPage = pathname.includes("/sell");
  const isGuidesPage = pathname.includes("/guides");

  const [previousPath, setPreviousPath] = useState("");

  useEffect(() => {
    setPreviousPath(pathname);
    console.log("pathname", pathname);
  }, [pathname, router]);

  return (
    <>
      <header
        className={`sticky top-0 flex ${
          isSellPage ? "justify-end" : "justify-center shadow-lg dark:shadow-white/15 xs:justify-between"
        } items-center h-[86px] z-[40] px-6 bg-background`}
      >
        {!isSellPage && (
          <div className={`${isSearchPage ? "hidden xs:flex" : "flex w-1/3 md:flex gap-3 lg:gap-6"}`}>
            <Button
              size={"largeIcon"}
              variant="outline"
              className={`flex text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group`}
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
              <div className="flex justify-center items-center gap-1">
                <div className="flex justify-center items-center">
                  <div className="flex">
                    <Logo width={"40"} height={"40"} />
                  </div>
                  {pathname !== "/" && (
                    <div className="flex sm:hidden">
                      <ChevronLeft />
                    </div>
                  )}
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
            {pathname === "/" && (
              <Link href="/guides">
                <Button
                  size={"largeIcon"}
                  variant="outline"
                  className={`flex text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group`}
                >
                  <div className="flex justify-center text-center items-center gap-2 p-1">
                    <div className="flex justify-center items-center">
                      <Icons.book_icon width={"22"} height={"22"} />
                    </div>
                    <h1 className={`${poppins.className} hidden xs:flex md:text-inline pr-1 align-middle`}>{guides}</h1>
                  </div>
                </Button>
              </Link>
            )}
          </div>
        )}
        {isSearchPage && (
          <div className="justify-center">
            <SearchBox isSmallMap={false} placeholder={searchPlaceholder} text={searchText} />
          </div>
        )}

        {/* This is the home page specific
        {!isSearchPage && !isSellPage && (
          <div className={`flex ${!isSearchPage && "w-1/3"} xs:hidden justify-center`}>
            <Button
              className="gap-2 items-center"
              onClick={() => {
                user ? router.push("/sell") : openSignUpModal();
              }}
            >
              <Icons.sell_home />
              <span className="xs:hidden lg:hidden">Sell</span>
              <span className="hidden xs:inline">Sell your property</span>
            </Button>
          </div>
        )} */}

        {!isSearchPage && !isSellPage && (
          <h1 className="hidden lg:flex flex-col justify-center flex-grow items-center text-center pb-8 pt-8 p-8">
            <span className="text-sm md:text-lg">{construction}</span>
            <span className="text-xs md:text-md">{construction_sub}</span>
          </h1>
        )}
        {!isSellPage && (
          <div className={`flex ${!isSearchPage && "w-1/3 flex-grow md:flex-grow-0"} gap-3 lg:gap-6 justify-end`}>
            {!isSearchPage && (
              <Button
                className="flex gap-2 items-center"
                onClick={() => {
                  user ? router.push("/sell") : openSignUpModal();
                }}
              >
                <Icons.sell_home />
                <span className="flex md:hidden">{sellButtonSmall}</span>
                <span className="hidden md:inline">{sellButtonBig}</span>
              </Button>
            )}
            <div className={`${isSearchPage && "hidden xs:flex"} justify-between gap-3 items-center`}>
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
