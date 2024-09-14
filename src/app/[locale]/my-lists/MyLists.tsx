"use client";

import { Trash2 } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteFavoriteList } from "@/app/[locale]/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReloadIcon } from "@radix-ui/react-icons";

interface Props {
  user: User;
  title: string;
  deleteText: string;
  typesObject: { id: string; name: string; translation: string }[];
}

export default function MyLists({ user, title, deleteText, typesObject }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (listId: number) => {
    setDeleting(true);
    await deleteFavoriteList(listId);
    setDeleting(false);
  };

  return (
    <div className="flex flex-col max-w-8xl h-full w-full">
      <div className="flex flex-col items-center w-full pb-8">
        <div className="flex w-full h-full justify-center text-2xl items-center py-8">
          <h1>{title}</h1>
        </div>
      </div>
      <div className="px-8 pb-4 overflow-y-auto grid grid-cols-1 2xs:grid-cols-1 grid-rows-2 w-full h-full xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-1 xl:grid-cols-5 xl:grid-rows-1 justify-center items-center gap-y-12 gap-x-6">
        {user.favoritedLists.map((list) => {
          return (
            <div
              key={list.id}
              className="flex flex-col shadow-lg py-4 gap-3 rounded-lg h-[270px] justify-center items-center w-full"
            >
              {list.homes.length > 0 ? (
                <div className="relative justify-center items-center w-full h-full rounded-xl overflow-hidden shadow-lg dark:shadow-white/15">
                  <Image
                    className="rounded-xl"
                    alt={list.homes[0].title!}
                    src={list.homes[0].photos[0]}
                    fill={true}
                    objectFit={"cover"}
                  />
                </div>
              ) : (
                <div className="flex text-center items-center rounded-t-xl w-full h-full bg-gray-200 dark:bg-gray-800">
                  No properties have been added to this list yet.
                </div>
              )}
              <div className="flex justify-between w-full px-3">
                <div className="flex flex-col w-full items-start">
                  <h1 className="font-medium">{list.name}</h1>
                  <h3 className="text-sm text-muted-foreground">
                    {list.homes.length === 0 ? "Empty" : `Properties: ${list.homes.length}`}
                  </h3>{" "}
                </div>
                <div className="flex h-full justify-end items-center">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button disabled={deleting} variant={"destructive"} size={"lgSqIcon"}>
                        {deleting ? (
                          <ReloadIcon className="animate-spin w-6 h-6" />
                        ) : (
                          <Trash2 strokeWidth={1.5} size={30} />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this list?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant={"destructive"}
                          onClick={() => {
                            handleDelete(list.id);
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
