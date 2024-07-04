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

export default function Header() {
  const pathname = usePathname();

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
            <div
              className={`flex justify-center items-center gap-3 text-primary/90 hover:text-primary/80 dark:text-foreground/90 dark:hover:text-foreground/80 hover:cursor-pointer group`}
            >
              <Image
                src={"./tuna.svg"}
                alt="Logo"
                width={50}
                height={50}
                className={`transition-transform duration-300 group-hover:rotate-6`}
              />
              <h1
                className={`${poppins.className} ${
                  isSearchPage ? "hidden 2xl:flex" : "flex"
                } text-3xl font-extralight text-center`}
              >
                viva ideal
              </h1>
            </div>
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
