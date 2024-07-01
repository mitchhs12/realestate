"use client";
import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Modals = ({ children, isOpen, onClose }: Props) => {
  const modalRootRef = useRef<HTMLDivElement | null>(null);
  const createdModalRoot = useRef(false);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let modalRoot = document.getElementById("modal-root");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "modal-root";
      document.body.appendChild(modalRoot);
      createdModalRoot.current = true; // Mark that we created the modal root
    }
    modalRootRef.current = modalRoot as HTMLDivElement; // Asserting type to HTMLDivElement

    return () => {
      if (modalRootRef.current && modalRootRef.current.parentNode === document.body) {
        document.body.removeChild(modalRootRef.current);
      }
    };
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  if (!isOpen || !modalRootRef.current) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalContentRef} className="fade-in-up shadow-md">
        {children}
      </div>
    </div>,
    modalRootRef.current
  );
};

export default Modals;
