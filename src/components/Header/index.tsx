"use client";
import Image from "next/image";
import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";
import { montserrat, poppins } from "@/app/fonts";
import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Header() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const themeBool = resolvedTheme === "dark" ? true : false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const isSearchPage = pathname === "/search";

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsLogin(false);
    setIsModalOpen(true);
  };

  const openLogInModal = () => {
    setIsLogin(true);
    setIsModalOpen(true);
  };

  return (
    <>
      <header
        className={`relative flex ${
          isSearchPage ? "justify-center" : "justify-between"
        } xs:justify-between items-center h-[80px] px-6 z-[10]`}
      >
        <div className={`${isSearchPage ? "hidden xs:flex" : "flex md:flex"}`}>
          <Link href="/">
            <Button
              size={"largeIcon"}
              variant="outline"
              className={`flex text-[#2dac5c] hover:text-primary/80 dark:text-foreground/90 dark:hover:text-foreground/80 hover:cursor-pointer group`}
            >
              <div className="flex justify-center items-center gap-1">
                <div className="flex justify-center items-center">
                  <Logo width={"38"} height={"38"} dark={themeBool} />
                </div>
                {/* <Image
                src={Logo}
                alt="Logo"
                width={50}
                height={50}
                className={`transition-transform duration-300 group-hover:rotate-6`}
              /> */}
                <h1
                  className={`${poppins.className} ${
                    isSearchPage ? "hidden 2xl:flex" : "flex"
                  } text-2xl font-light pr-2`}
                >
                  viva ideal
                </h1>
              </div>
            </Button>
          </Link>
        </div>

        <div className="flex justify-center">
          {isSearchPage && (
            <div className="flex">
              <SearchBox />
            </div>
          )}
        </div>

        <div className={`${isSearchPage && "hidden xs:flex"} justify-between gap-3 items-center`}>
          <ProfileButton openSignUpModal={openSignUpModal} openLogInModal={openLogInModal} />
        </div>
      </header>

      <div className="flex relative z-100">
        <ModalPortal isOpen={isModalOpen} onClose={closeModal}>
          <Modal isLogin={isLogin} setIsLogin={setIsLogin} />
        </ModalPortal>
      </div>
    </>
  );
}
