"use client";

import { ModalPortal } from "@/components/ModalPortal";
import { Modal } from "@/components/Modal";
import { useContext, useEffect } from "react";
import { QueryContext } from "@/context/QueryContext";
import { I18nProviderClient } from "@/locales/client";

export default function LockedLogin({ locale, customMessage }: { locale: string; customMessage?: string }) {
  const { lockModal } = useContext(QueryContext);

  useEffect(() => {
    lockModal();
  }, []);

  return (
    <div className="flex relative z-100">
      <I18nProviderClient locale={locale}>
        <ModalPortal>
          <Modal customMessage={customMessage} />
        </ModalPortal>
      </I18nProviderClient>
    </div>
  );
}
