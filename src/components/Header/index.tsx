"use client";
import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";
import { poppins } from "@/app/fonts";
import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useState, useEffect } from "react";
import SearchBox from "@/components/SearchBox";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  const { resolvedTheme } = useTheme();
  const themeBool = resolvedTheme === "dark" ? true : false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    console.log("current isLoginOpen", isLoginOpen);
  }, [isLoginOpen]);

  const isSearchPage = pathname.includes("/search/");
  const isSellPage = pathname.includes("/sell");

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsLoginOpen(false);
    setIsModalOpen(true);
  };

  const openLogInModal = () => {
    setIsLoginOpen(true);
    setIsModalOpen(true);
  };

  return (
    <>
      <header
        className={`sticky top-0 flex ${
          isSellPage ? "justify-end" : "justify-center shadow-lg xs:justify-between"
        } items-center h-[86px] z-[10] px-6 bg-background`}
      >
        {!isSellPage && (
          <div className={`${isSearchPage ? "hidden xs:flex" : "flex w-1/3 md:flex"}`}>
            <Link href="/">
              <Button
                size={"largeIcon"}
                variant="outline"
                className={`flex text-[#2dac5c] hover:text-primary/80 hover:cursor-pointer group`}
              >
                <div className="flex justify-center items-center gap-1">
                  <div className="flex justify-center items-center">
                    <Logo width={"40"} height={"40"} />
                  </div>
                  <h1
                    className={`${poppins.className} ${
                      isSearchPage ? "hidden 2xl:flex" : "hidden sm:flex"
                    } text-lg pr-2 font-normal align-middle`}
                  >
                    VIVA IDEAL
                  </h1>
                </div>
              </Button>
            </Link>
          </div>
        )}

        {isSearchPage && (
          <div className="justify-center">
            <SearchBox isSmallMap={false} />
          </div>
        )}
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
        )}

        <h1 className="hidden lg:flex flex-col justify-center items-center text-center pb-8 pt-8">
          <span className="text-md md:text-2xl">This site is under construction.</span>
          <span className="text-sm md:text-lg">
            Please create an account, and we&apos;ll email you when it&apos;s ready.
          </span>
        </h1>

        {!isSellPage && (
          <div className={`flex ${!isSearchPage && "w-1/3"} gap-6 justify-end`}>
            {!isSearchPage && (
              <Button
                className="hidden xs:flex gap-2 items-center"
                onClick={() => {
                  user ? router.push("/sell") : openSignUpModal();
                }}
              >
                <Icons.sell_home />
                <span className="xs:hidden lg:hidden">Sell</span>
                <span className="hidden xs:inline">Sell your property</span>
              </Button>
            )}
            <div className={`${isSearchPage && "hidden xs:flex"} justify-between gap-3 items-center`}>
              <ProfileButton openSignUpModal={openSignUpModal} openLogInModal={openLogInModal} session={session} />
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
            <span className="sm:hidden">Exit</span>
            <span className="hidden sm:flex">Save and exit</span>
          </Button>
        )}
      </header>

      <div className="flex relative z-100">
        <ModalPortal isOpen={isModalOpen} onClose={closeModal}>
          <Modal isLoginOpen={isLoginOpen} setIsLoginOpen={setIsLoginOpen} />
        </ModalPortal>
      </div>
    </>
  );
}
