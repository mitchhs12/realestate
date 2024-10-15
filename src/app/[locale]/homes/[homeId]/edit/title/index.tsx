"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { HomeContext } from "@/context/HomeContext";
import { useScopedI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

// interface Props {
//   title_text: string;
//   subtitle: string;
//   warning: string;
//   setConfirmDisabled: React.Dispatch<React.SetStateAction<boolean>>;
// }

export default function Title() {
  const { editedHome, setEditedHome, handleSaveEdits, saveLoading } = useContext(HomeContext);
  const [title, setTitle] = useState<string>(editedHome?.title ? editedHome?.title : "");
  const [saveDisabled, setSaveDisabled] = useState(true);
  const t = useScopedI18n("sell.title");

  useEffect(() => {
    if (editedHome && title.length > 0 && title.length <= 32 && title !== editedHome.title) {
      setEditedHome({ ...editedHome, title: title });
      setSaveDisabled(false);
    } else {
      setSaveDisabled(true);
    }
  }, [title]);

  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (newValue.length <= 32) {
      setTitle(newValue);
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full h-full justify-center items-center gap-3">
          <div className="flex flex-col w-full h-full justify-center items-center gap-3">
            <div className="flex items-center justify-center py-3">
              <h1 className="flex items-center text-3xl">{t("title")}</h1>
            </div>
            <div className="flex flex-col px-8 mt-5">
              <h3 className="text-lg w-full">{t("subtitle")}</h3>
            </div>
          </div>
          <div className="flex flex-col px-8 justify-center w-full h-full">
            <div className="flex h-full w-auto justify-center items-end">
              <Input
                type="text"
                value={title}
                placeholder="Enter your property title..."
                className={`w-full text-center resize-y overflow-y-auto ${title.length === 32 && "border-red-500"}`}
                onChange={handleChange}
              />
            </div>
            {/* Set a min-height to reserve space for the warning */}
            <div className="flex h-6 justify-center text-sm">
              <span className={`${title.length === 32 ? "visible text-red-500" : "invisible"}`}>{t("warning")}</span>
            </div>
          </div>
        </div>
        <Button variant={"default"} onClick={handleSaveEdits} disabled={saveDisabled || saveLoading}>
          {saveLoading ? <ReloadIcon className="w-6 h-6 animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}
