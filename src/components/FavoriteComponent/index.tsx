"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useState } from "react";
import { createFavoriteList } from "@/app/[locale]/actions";
import { HomeType } from "@/lib/validations";
import { User } from "next-auth";
import Image from "next/image";

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
  const [listName, setListName] = useState("Favorites");

  console.log("user", user.favoritedLists[0]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Heart
          strokeWidth={"1.5"}
          onClick={() => {
            setDialogOpen(true);
          }}
          className={`flex shadow-lg absolute hover:cursor-pointer right-2 top-2 size-8 ${dialogOpen && "fill-pink-500"} text-white ${home.isFavoritedByUser && "fill-pink-500"} hover:fill-pink-500`}
        />
      </DialogTrigger>
      <DialogContent className="w-80 rounded-md">
        {user.favoritedLists.length > 0 ? (
          user.favoritedLists.map((list) => {
            return (
              <div className="flex gap-4 py-4 w-full">
                <div className="relative w-full h-[200px]">
                  <Image src={list.homes[0].photos[0]} fill={true} objectFit={"cover"} />
                </div>
              </div>
            );
          })
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Add to list</DialogTitle>
              <DialogDescription>Save this home for later.</DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 py-4 w-full">
              <div className="items-center gap-4 w-full">
                <Label htmlFor="name" className="text-right">
                  Name of list
                </Label>
                <Input
                  type="text"
                  value={listName}
                  onChange={(e) => {
                    setListName(e.target.value);
                  }}
                  className="flex w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleFavorite}>
                Create New List
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
