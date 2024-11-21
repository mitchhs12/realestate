"use client";

import { useScopedI18n } from "@/locales/client";
import { HomeType } from "@/lib/validations";
import { findMatching } from "@/lib/utils";
import { useState } from "react";
import { typesMap } from "@/lib/sellFlowData";
import ResizableCard from "@/components/ResizableCard";
import { User } from "next-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export function Modal({
  unfinishedHomes,
  user,
  modalOpen,
  setModalOpen,
}: {
  unfinishedHomes: HomeType[];
  user: User;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}) {
  const mp = useScopedI18n("my-properties");
  const t = useScopedI18n("sell.type");
  const p = useScopedI18n("sell.checkout.premium");
  const u = useScopedI18n("sell.sell-flow.unfinishedProperties");

  const typesObject = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: t(`options.${index}` as keyof typeof t),
  }));

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="flex flex-col w-[90%] max-w-7xl h-[90%]">
        <DialogHeader className="p-2 sm:p-4 md:px-6">
          <DialogTitle className="text-2xl font-semibold">{u("title")}</DialogTitle>
          <DialogDescription>{u("subtitle")}</DialogDescription>
        </DialogHeader>
        <div className="p-2 sm:p-4 md:px-6 overflow-y-auto w-full grid grid-cols-1 2xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-center gap-2 md:gap-4 lg:gap-5 xl:gap-5">
          {unfinishedHomes.map((home: HomeType, index: number) => {
            const matchingTypes = findMatching(typesObject, home, "type");

            return (
              <div
                key={index}
                className={`flex flex-col h-full w-full space-y-2 shadow-lg dark:shadow-white/10 rounded-lg`}
              >
                <ResizableCard
                  home={home}
                  finishSelling={mp("finishSelling")}
                  incompleteListing={mp("incompleteListing")}
                  types={matchingTypes}
                  userId={user!.id}
                  premiumText={p("title")}
                />
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
