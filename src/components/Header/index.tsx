"use client";
import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";
import { poppins } from "@/app/fonts";
import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Header() {
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const { resolvedTheme } = useTheme();
  const themeBool = resolvedTheme === "dark" ? true : false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handleLogin, setHandleLogin] = useState(false);

  const isSearchPage = pathname === "/search";
  const isSellPage = pathname === "/sell";

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSignUpModal = () => {
    setHandleLogin(false);
    setIsModalOpen(true);
  };

  const openLogInModal = () => {
    setHandleLogin(true);
    setIsModalOpen(true);
  };

  return (
    <>
      <header
        className={`relative flex ${
          !isSellPage && "justify-center"
        } xs:justify-between items-center h-[86px] px-6 z-[10]`}
      >
        {!isSellPage ? (
          <div className={`${isSearchPage ? "hidden xs:flex" : "flex w-1/3 md:flex"}`}>
            <Link href="/">
              <Button
                size={"largeIcon"}
                variant="outline"
                className={`flex text-[#2dac5c] hover:text-primary/80 dark:text-foreground/90 dark:hover:text-foreground/80 hover:cursor-pointer group`}
              >
                <div className="flex justify-center items-center gap-1">
                  <div className="flex justify-center items-center">
                    <Logo width={"40"} height={"40"} dark={themeBool} />
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
        ) : (
          <div className="lg:hidden gap-6 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                router.push("/");
              }}
            >
              Exit
            </Button>
          </div>
        )}

        {isSearchPage && (
          <div className="justify-center">
            <SearchBox />
          </div>
        )}
        {!isSearchPage && !isSellPage && (
          <div className={`flex ${!isSearchPage && "w-1/3"} xs:hidden justify-center`}>
            <Button className="gap-2 items-center">
              <Icons.sell_home />
              <span className="xs:hidden lg:hidden">Sell</span>
              <span className="hidden xs:inline">Sell your home</span>
            </Button>
          </div>
        )}

        {!isSellPage ? (
          <div className={`flex ${!isSearchPage && "w-1/3"} gap-6 justify-end`}>
            {!isSearchPage && (
              <Button className="hidden xs:flex gap-2 items-center" onClick={() => router.push("/sell")}>
                <Icons.sell_home />
                <span className="xs:hidden lg:hidden">Sell</span>
                <span className="hidden xs:inline">Sell your home</span>
              </Button>
            )}
            <div className={`${isSearchPage && "hidden xs:flex"} justify-between gap-3 items-center`}>
              <ProfileButton openSignUpModal={openSignUpModal} openLogInModal={openLogInModal} />
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex gap-6 justify-end">
            <Button variant="outline">Exit</Button>
          </div>
        )}
      </header>

      <div className="flex relative z-100">
        <ModalPortal isOpen={isModalOpen} onClose={closeModal}>
          <Modal handleLogin={handleLogin} setHandleLogin={setHandleLogin} />
        </ModalPortal>
      </div>
    </>
  );
}
