"use client";

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createFavoriteList } from "@/app/[locale]/actions";
import { HomeType } from "@/lib/validations";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";

interface Props {
  home: HomeType & { isFavoritedByUser: boolean };
  translations: {
    createTitle: string;
    createSubtitle: string;
    placeholder: string;
    nameText: string;
    createButton: string;
    notUniqueWarning: string;
  };
}

export default function CreateDialog({ home, translations }: Props) {
  const pathname = usePathname();
  const { user } = useContext(LocaleContext);
  const [listName, setListName] = useState("");
  const [nameNotUnique, setNameNotUnique] = useState(false);

  const updateName = (value: string) => {
    setListName(value);
    user?.favoritedLists.some((l) => l.name === value) ? setNameNotUnique(true) : setNameNotUnique(false);
  };

  const handleFavorite = () => {
    createFavoriteList(listName, home.id, pathname);
  };

  return (
    <div className="flex flex-col justify-start items-center w-full h-full p-4">
      <DialogHeader className="items-center pb-8">
        <DialogTitle className="text-lg lg:text-xl">{translations.createTitle}</DialogTitle>
        <DialogDescription className="text-md lg:text-lg">{translations.createSubtitle}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col justify-start items-center w-full h-full">
        <div className="flex gap-4 py-4 max-w-[600px] w-full">
          <div className="items-center gap-4 w-full">
            <Label htmlFor="name" className="text-right">
              {translations.nameText}
            </Label>
            <Input
              type="text"
              placeholder={translations.placeholder}
              value={listName}
              maxLength={50}
              onChange={(e) => {
                updateName(e.target.value);
              }}
              className="flex w-full"
            />
          </div>
        </div>
        <DialogFooter className="w-full h-full">
          <div className="flex flex-col items-center justify-end gap-3 w-full">
            <Button disabled={nameNotUnique} className="max-w-[600px] w-full" onClick={handleFavorite}>
              {translations.createButton}
            </Button>
            {nameNotUnique && <p className="text-red-500 text-center">{translations.notUniqueWarning}</p>}
          </div>
        </DialogFooter>
      </div>
    </div>
  );
}
