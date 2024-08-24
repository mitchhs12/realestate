"use client";

import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useEffect, useState } from "react";

export default function LockedLogin() {
  const [openState, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <ModalPortal>
      <Modal />
    </ModalPortal>
  );
}
