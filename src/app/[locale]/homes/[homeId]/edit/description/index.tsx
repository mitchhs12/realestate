"use client";
import { useContext, useEffect, useState } from "react";
import { HomeType } from "@/lib/validations";
import ReactQuill from "react-quill";
import "@/app/[locale]/quill.css"; // Import Quill styles
import { HomeContext } from "@/context/HomeContext";
import { useScopedI18n } from "@/locales/client";

export default function Description() {
  const { editedHome, setEditedHome, handleSaveEdits, saveLoading } = useContext(HomeContext);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const t = useScopedI18n("sell.description");
  const [description, setDescription] = useState<string>(editedHome?.description ? editedHome?.description : "");

  useEffect(() => {
    setSaveDisabled(description.length === 0);
  }, []);

  useEffect(() => {
    if (editedHome && description.length > 0 && description.length < 3000) {
      setSaveDisabled(false);
      setEditedHome({ ...editedHome, description: description });
    } else {
      setSaveDisabled(true);
    }
  }, [description]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{t("title")}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{t("subtitle")}</h3>
          </div>
        </div>

        <div className="flex flex-col max-w-8xl h-auto w-full justify-center mt-10 shadow-lg dark:shadow-white rounded-xl">
          <ReactQuill
            value={description}
            theme={"snow"}
            placeholder={t("placeholder")}
            className={`flex flex-col h-full max-w-8xl w-full overflow-auto text-sm rounded-t-xl placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${description.length === 3000 && "border-red-500"}`}
            onChange={(value: string) => {
              if (value.length <= 3000) {
                setDescription(value);
              }
            }}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ],
            }}
            formats={["header", "font", "bold", "italic", "underline", "list"]}
          />
          <div className="flex justify-center text-sm min-h-12">
            {description.length === 3000 && <span className="text-red-500">{t("warning")}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
