"use client";
import Image from "next/image";
import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";
import { montserrat } from "@/app/fonts";
import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

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
      <header className={`relative flex justify-between items-center h-[80px] px-4 z-[10]`}>
        <Link href="/">
          <div className="flex justify-center items-center hover:text-primary text-secondary-foreground hover:cursor-pointer group">
            <Image
              src={"./tuna.svg"}
              alt="Logo"
              width={50}
              height={50}
              className="transition-transform duration-300 group-hover:rotate-6"
            />
            <h1 className={`${montserrat.className} hidden pl-4 text-3xl font-[500]`}>Propertuna</h1>
          </div>
        </Link>

        {pathname === "/search" && (
          <div className="flex">
            <SearchBox />
          </div>
        )}

        <div className="flex justify-between gap-3 items-center">
          <ProfileButton openSignUpModal={openSignUpModal} openLogInModal={openLogInModal} />
        </div>
        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 divider z-0" />
      </header>

      <div className="flex relative z-100">
        <ModalPortal isOpen={isModalOpen} onClose={closeModal}>
          <Modal isLogin={isLogin} setIsLogin={setIsLogin} />
        </ModalPortal>
      </div>
    </>
  );
}
