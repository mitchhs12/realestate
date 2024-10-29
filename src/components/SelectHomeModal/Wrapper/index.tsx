"use client";

import { I18nProviderClient } from "@/locales/client";
import { HomeType } from "@/lib/validations";
import { User } from "next-auth";
import { Modal } from "@/components/SelectHomeModal/Modal";

export default function LockedLogin({
  locale,
  unfinishedHomes,
  user,
}: {
  locale: string;
  unfinishedHomes: HomeType[];
  user: User;
}) {
  return (
    <div className="flex relative z-200 w-full h-full">
      <I18nProviderClient locale={locale}>
        <Modal unfinishedHomes={unfinishedHomes} user={user} />
      </I18nProviderClient>
    </div>
  );
}
