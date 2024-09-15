"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HomeType } from "@/lib/validations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Minus, Plus, Trash2 } from "lucide-react";
import { removeHomeFromFavoriteList, updateFavoriteList, deleteFavoriteList } from "@/app/[locale]/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useScopedI18n } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";
import { User } from "next-auth";
import { QueryContext } from "@/context/QueryContext";
import { usePathname } from "next/navigation";

interface Props {
  list: {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    homes: HomeType[];
  };
  homeToBeFavorited?: HomeType & { isFavoritedByUser: boolean };
  translations: {
    warning: string;
    action: string;
    cancel: string;
    delete: string;
    noProperties: string;
  };
}

export default function ListCard({ list, homeToBeFavorited, translations }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, setUser } = useContext(LocaleContext);
  const pathname = usePathname();

  const handleDelete = async (listId: number, user: User) => {
    setIsDeleting(true);
    await deleteFavoriteList(listId);
    const updatedLists = user.favoritedLists.filter((list) => list.id !== listId);
    setUser({ ...user, favoritedLists: updatedLists });
    setIsDeleting(false);
  };

  const handleAddToList = async (listId: number, home: HomeType & { isFavoritedByUser: boolean }, user: User) => {
    setIsLoading(true);
    await updateFavoriteList(listId, home.id, pathname);
    const { isFavoritedByUser, ...homeWithoutFavoriteStatus } = home;

    const updatedLists = user.favoritedLists.map((list) =>
      list.id === listId ? { ...list, homes: [...list.homes, homeWithoutFavoriteStatus] } : list
    );

    setUser({ ...user, favoritedLists: updatedLists });
    setIsLoading(false);
  };

  const handleRemoveFromList = async (listId: number, home: HomeType & { isFavoritedByUser: boolean }, user: User) => {
    setIsLoading(true);
    await removeHomeFromFavoriteList(listId, home.id, pathname);
    const updatedLists = user.favoritedLists.map((list) =>
      list.id === listId ? { ...list, homes: list.homes.filter((h) => h.id !== home.id) } : list
    );
    setUser({ ...user, favoritedLists: updatedLists });
    setIsLoading(false);
  };

  return (
    <div key={list.id} className="flex flex-col gap-3 rounded-lg justify-center items-center h-full w-full">
      <div
        className={`relative w-full h-[200px] rounded-lg overflow-hidden shadow-lg dark:shadow-white/15 ${
          list.homes.length === 1
            ? "grid-cols-1 grid-rows-1"
            : list.homes.length === 2
              ? "grid grid-cols-2 grid-rows-1"
              : list.homes.length === 3
                ? "grid grid-cols-3 grid-rows-1"
                : "grid grid-cols-2 grid-rows-2"
        }`}
      >
        {list.homes.length > 0 ? (
          list.homes.slice(0, 4).map((home, index) => (
            <div key={home.id} className="relative w-full h-full">
              <Image alt={home.title!} src={home.photos[0]} fill={true} objectFit={"cover"} />
            </div>
          ))
        ) : (
          <div className="flex text-center items-center px-8 rounded-t-xl w-full h-full bg-gray-200 dark:bg-gray-800">
            {translations.noProperties}
          </div>
        )}
        <div className="absolute top-3 left-3">
          {homeToBeFavorited &&
            user &&
            (list.homes.some((h: HomeType) => h.id === homeToBeFavorited.id) ? (
              <Button
                variant={"destructive"}
                className="gap-2"
                size={"icon"}
                onClick={() => {
                  handleRemoveFromList(list.id, homeToBeFavorited, user);
                }}
                disabled={isLoading || isDeleting}
              >
                {isLoading ? <ReloadIcon className="animate-spin h-5 w-5" /> : <Minus size={20} />}
              </Button>
            ) : (
              <Button
                variant={"default"}
                className="gap-2"
                size={"icon"}
                onClick={() => {
                  handleAddToList(list.id, homeToBeFavorited, user);
                }}
                disabled={isLoading || isDeleting}
              >
                {isLoading ? <ReloadIcon className="animate-spin h-5 w-5" /> : <Plus size={20} />}
              </Button>
            ))}
        </div>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col w-full items-start">
          <h1 className="font-medium">{list.name}</h1>
          <h3 className="text-sm text-muted-foreground">
            {list.homes.length === 0 ? "Empty" : `Properties: ${list.homes.length}`}
          </h3>{" "}
        </div>
        <div className="flex h-full justify-end items-center">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="flex-grow" disabled={isDeleting || isLoading} variant={"destructive"} size={"icon"}>
                {isDeleting ? <ReloadIcon className="animate-spin w-6 h-6" /> : <Trash2 size={20} />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{translations.warning}</AlertDialogTitle>
                <AlertDialogDescription>{translations.action}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{translations.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  variant={"destructive"}
                  onClick={() => {
                    handleDelete(list.id, user!);
                  }}
                >
                  {translations.delete}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
