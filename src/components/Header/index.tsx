"use client";
import Image from "next/image";
import Link from "next/link";
import { ProfileButton } from "@/components/ProfileButton";
import { montserrat } from "@/app/fonts";
import { useState } from "react";
import { SignUp } from "@/components/SignUp";
import { LogIn } from "@/components/LogIn";
import { Modal } from "@/components/Modal";

export default function Header() {
  // create modal state
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const closeModals = () => {
    setSignUpModalOpen(false);
    setLoginModalOpen(false);
  };

  const switchModals = () => {
    console.log("running!");
    setSignUpModalOpen(!signUpModalOpen);
    setLoginModalOpen(!loginModalOpen);
  };

  return (
    <>
      <header className={`relative flex justify-between items-center h-[80px] px-4 z-[10]`}>
        <Link href="/">
          <div className="flex justify-center items-center hover:text-primary hover:cursor-pointer group">
            <Image
              src={"./tuna.svg"}
              alt="Logo"
              width={50}
              height={50}
              className="transition-transform duration-300 group-hover:rotate-6"
            />
            <h1 className={`${montserrat.className} flex pl-6 text-3xl font-[500]`}>Propertuna</h1>
          </div>
        </Link>

        <nav className="flex justify-between gap-3 items-center">
          <ProfileButton setSignUpModalOpen={setSignUpModalOpen} setLoginModalOpen={setLoginModalOpen} />
        </nav>
        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 divider z-0" />
      </header>
      {/* Modals */}
      <div className="flex relative z-100">
        {/* Modals */}
        <Modal isOpen={signUpModalOpen} onClose={closeModals}>
          <SignUp switchModals={switchModals} />
        </Modal>
        <Modal isOpen={loginModalOpen} onClose={closeModals}>
          <LogIn switchModals={switchModals} />
        </Modal>
      </div>
    </>
  );
}
