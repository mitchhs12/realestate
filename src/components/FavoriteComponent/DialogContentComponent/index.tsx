"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, List, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";
import ListCard from "@/components/FavoriteComponent/ListCard";
import CreateDialog from "@/components/FavoriteComponent/CreateDialog";
import { useScopedI18n } from "@/locales/client";
import { HomeType } from "@/lib/validations";
import { useState } from "react";

interface Props {
  existingDialog: boolean;
  setExistingDialog: (value: boolean) => void;
  user: User;
  home: HomeType;
}

export default function DialogContentComponent({ existingDialog, setExistingDialog, user, home }: Props) {
  const t = useScopedI18n("my-lists");

  const createTranslations = {
    createTitle: t("createTitle"),
    createSubtitle: t("createSubtitle"),
    nameText: t("name"),
    placeholder: t("placeholder"),
    createButton: t("createButton"),
    notUniqueWarning: t("notUniqueWarning"),
  };

  return user.favoritedLists.length === 0 ? (
    <CreateDialog home={home} translations={createTranslations} setExistingDialog={setExistingDialog} />
  ) : existingDialog ? (
    <div className="flex flex-col w-full overflow-y-auto">
      <div className="flex p-4 w-full justify-between pb-8">
        <Button className="flex gap-2" onClick={() => setExistingDialog(!existingDialog)}>
          <Plus size={20} />
          <span>{t("create")}</span>
        </Button>
        <Button variant={"outline"} className="flex gap-2" asChild>
          <Link href={"/my-wishlists"}>
            <List size={20} />
            <span>{t("manage")}</span>
          </Link>
        </Button>
      </div>
      <DialogHeader className="sticky top-0 z-10 bg-background pb-8 px-6 shadow-lg dark:shadow-white/10">
        <DialogTitle className="text-lg lg:text-xl">{`${t("modalTitle")} (${user.favoritedLists.length})`}</DialogTitle>
        <DialogDescription className="text-md lg:text-lg">{t("subtitle")}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col justify-start items-center overflow-auto h-full w-full px-6 pt-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 w-full gap-10 pb-10">
          {user.favoritedLists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              homeToBeFavorited={home}
              translations={{
                warning: t("warning"),
                action: t("action"),
                cancel: t("cancel"),
                delete: t("delete"),
                noProperties: t("no-properties"),
                properties: t("properties"),
                empty: t("empty"),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex w-full justify-between">
        <Button className="flex gap-2" variant="outline" onClick={() => setExistingDialog(!existingDialog)}>
          <ChevronLeft size={20} /> <span className="hidden md:flex">{t("back")}</span>
        </Button>
        <Button variant={"outline"} className="flex gap-2" asChild>
          <Link href={"/my-wishlists"}>
            <List size={20} />
            <span>{t("manage")}</span>
          </Link>
        </Button>
      </div>
      <CreateDialog home={home} translations={createTranslations} setExistingDialog={setExistingDialog} />
    </div>
  );
}
