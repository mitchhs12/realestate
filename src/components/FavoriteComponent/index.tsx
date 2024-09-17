"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import { useState, useContext } from "react";
import { User } from "next-auth";
import { HomeType } from "@/lib/validations";
import { I18nProviderClient } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";
import DialogContentComponent from "@/components/FavoriteComponent/DialogContentComponent";

interface Props {
  user: User;
  home: HomeType;
  large?: boolean;
}

export function FavoriteComponent({ user, home, large }: Props) {
  const { defaultLanguage } = useContext(LocaleContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [existingDialog, setExistingDialog] = useState(true);
  const isFavorited = user.favoritedLists.some((list) => list.homes.some((h) => h.id === home.id));

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Heart
          strokeWidth={"1.5"}
          onClick={() => {
            setModalOpen(true);
            setExistingDialog(true);
          }}
          className={`flex absolute hover:cursor-pointer right-2 top-2 ${large ? "size-12" : "size-8"} ${modalOpen && "animate-pulse fill-primary"} text-white ${isFavorited && "fill-pink-500"} hover:fill-pink-500`}
        />
      </DialogTrigger>
      <DialogContent
        className="w-[85%] max-w-5xl h-full max-h-[540px] rounded-md p-0"
        close={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <I18nProviderClient locale={defaultLanguage}>
          <DialogContentComponent
            existingDialog={existingDialog}
            setExistingDialog={setExistingDialog}
            user={user}
            home={home}
          />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
