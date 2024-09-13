import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface Props {
  listName: string;
  updateName: (value: any) => void;
  handleFavorite: () => void;
  nameNotUnique: boolean;
}

export default function CreateDialog({ listName, updateName, handleFavorite, nameNotUnique }: Props) {
  return (
    <div className="flex flex-col justify-center w-full p-4">
      <DialogHeader className="items-center pb-8">
        <DialogTitle className="text-lg lg:text-xl">Create new list</DialogTitle>
        <DialogDescription className="text-md lg:text-lg">Save this home to a new list.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col justify-start items-center w-full">
        <div className="flex gap-4 py-4 max-w-[600px] w-full">
          <div className="items-center gap-4 w-full">
            <Label htmlFor="name" className="text-right">
              Name of list
            </Label>
            <Input
              type="text"
              placeholder={"Favorites"}
              value={listName}
              maxLength={50}
              onChange={(e) => {
                updateName(e);
              }}
              className="flex w-full"
            />
          </div>
        </div>
        <DialogFooter className="w-full">
          <div className="flex flex-col items-center justify-center gap-3 w-full">
            <Button disabled={nameNotUnique} className="w-full" onClick={handleFavorite}>
              Create New List
            </Button>
            {nameNotUnique && <p className="text-red-500 text-center">You already have a list with that name.</p>}
          </div>
        </DialogFooter>
      </div>
    </div>
  );
}
