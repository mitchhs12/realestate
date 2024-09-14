"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  createFavoriteList,
  removeHomeFromFavoriteList,
  updateFavoriteList,
  deleteFavoriteList,
} from "@/app/[locale]/actions";
import { HomeType } from "@/lib/validations";
import { User } from "next-auth";
import Image from "next/image";
import CreateDialog from "./CreateDialog";
import { ChevronLeft, Minus, Plus, List, ListPlus } from "lucide-react";
import Link from "next/link";

interface Props {
  home: HomeType & { isFavoritedByUser: boolean };
  user: User;
}

export function FavoriteComponent({ home, user }: Props) {
  const handleFavorite = () => {
    createFavoriteList(listName, home.id);
    setDialogOpen(false);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingDialog, setExistingDialog] = useState(true);
  const [listName, setListName] = useState("");
  const [nameNotUnique, setNameNotUnique] = useState(false);

  const updateName = (e: any) => {
    setListName(e.target.value);
    user.favoritedLists.some((l) => l.name === e.target.value) ? setNameNotUnique(true) : setNameNotUnique(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Heart
          strokeWidth={"1.5"}
          onClick={() => {
            setDialogOpen(true);
            setExistingDialog(true);
          }}
          className={`flex shadow-lg absolute hover:cursor-pointer right-2 top-2 size-8 ${dialogOpen && "fill-pink-500"} text-white ${home.isFavoritedByUser && "fill-pink-500"} hover:fill-pink-500`}
        />
      </DialogTrigger>
      <DialogContent className="w-[85%] max-w-5xl h-full max-h-[500px] rounded-md p-0" close={false}>
        {user.favoritedLists.length === 0 ? (
          <CreateDialog
            listName={listName}
            updateName={updateName}
            handleFavorite={handleFavorite}
            nameNotUnique={nameNotUnique}
          />
        ) : existingDialog ? (
          <div className="flex flex-col w-full overflow-y-auto">
            <div className="flex p-4 w-full justify-between pb-8">
              <Button className="flex gap-2" onClick={() => setExistingDialog(!existingDialog)}>
                <Plus size={20} />
                <span>Create</span>
              </Button>
              <Button variant={"outline"} className="flex gap-2" asChild>
                <Link href={"/my-lists"}>
                  <List />
                  <span>Manage</span>
                </Link>
              </Button>
            </div>
            <DialogHeader className="sticky top-0 z-10 bg-background pb-8 px-6 shadow-lg dark:shadow-white/10">
              <DialogTitle className="text-lg lg:text-xl">Existing Lists</DialogTitle>
              <DialogDescription className="text-md lg:text-lg">
                Save this property to one of your existing lists.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col justify-start items-center overflow-auto h-full w-full px-6 pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-10 pb-10">
                {user.favoritedLists.map((list) => {
                  return (
                    <div className="flex flex-col gap-3 rounded-lg justify-center items-center h-full w-full">
                      <div className="relative w-full h-[200px] rounded-lg overflow-hidden shadow-lg dark:shadow-white/15">
                        <Image
                          className="rounded-xl"
                          alt={list.homes[0].title!}
                          src={list.homes[0].photos[0]}
                          fill={true}
                          objectFit={"cover"}
                        />
                        <div className="absolute bottom-3 right-3">
                          {list.homes.some((h: HomeType) => h.id === home.id) ? (
                            <Button
                              variant={"destructive"}
                              className="gap-2"
                              onClick={() => {
                                removeHomeFromFavoriteList(list.id, home.id);
                              }}
                            >
                              <Minus size={20} />
                              Remove
                            </Button>
                          ) : (
                            <Button
                              variant={"default"}
                              className="gap-2"
                              onClick={() => {
                                updateFavoriteList(list.id, home.id);
                              }}
                            >
                              <Plus size={20} />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col w-full pl-3 items-start">
                          <h1 className="font-medium">{list.name}</h1>
                          <h3 className="text-sm text-muted-foreground">Properties: {list.homes.length}</h3>{" "}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex w-full justify-start">
              <Button className="flex gap-2" variant="outline" onClick={() => setExistingDialog(!existingDialog)}>
                <ChevronLeft size={20} /> <span className="hidden md:flex">Back</span>
              </Button>
            </div>
            <CreateDialog
              listName={listName}
              updateName={updateName}
              handleFavorite={handleFavorite}
              nameNotUnique={nameNotUnique}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
