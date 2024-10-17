"use client";
import React, { useContext, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstLetter } from "@/lib/utils";
import { typeIcons } from "@/components/Icons/typeIcons";
import { HomeContext } from "@/context/HomeContext";
import { useScopedI18n } from "@/locales/client";
import { typesMap } from "@/lib/sellFlowData";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Type() {
  const { editedHome, setEditedHome, handleSaveEdits, saveLoading } = useContext(HomeContext);
  const [selection, setSelection] = useState<string[]>(editedHome?.type || []);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const t = useScopedI18n("sell.type");
  const h = useScopedI18n("homes");

  const options = Array.from({ length: 17 }, (_, index) => ({
    id: typesMap[index].id,
    name: typesMap[index].name,
    translation: t(`options.${index}` as keyof typeof t),
  }));

  useEffect(() => {
    if (editedHome) {
      setEditedHome({ ...editedHome, type: selection });
      setSaveDisabled(false);
    } else {
      setSaveDisabled(true);
    }
  }, [selection]);

  return (
    <div className="flex flex-col h-full w-full items-center gap-t-20">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col pb-4">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{t("title")}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{t("subtitle")}</h3>
          </div>
        </div>
        <div className="flex flex-col w-full h-full sm:h-full px-4 justify-start items-center overflow-auto">
          <ToggleGroup
            type="multiple"
            value={selection}
            defaultValue={selection}
            onValueChange={(value) => {
              if (value) setSelection(value.map(capitalizeFirstLetter));
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-8 items-center justify-center">
              {options.map((type, index) => {
                const IconComponent = typeIcons[type.id as keyof typeof typeIcons]; // Get the corresponding icon
                return (
                  <ToggleGroupItem
                    variant={"outline"}
                    key={index}
                    value={type.name}
                    className="flex h-[50px] md:h-[100px] items-center justify-center text-sm md:text-lg"
                  >
                    <div className="flex w-full justify-center gap-2 items-center text-center text-xs sm:text-sm md:text-md lg:text-lg">
                      {IconComponent && (
                        <div className="flex w-1/3 justify-center items-center">
                          <IconComponent color="gray" width={40} height={40} />
                        </div>
                      )}
                      <div className="flex w-2/3 justify-start text-start">{type.translation}</div>
                    </div>
                  </ToggleGroupItem>
                );
              })}
            </div>
          </ToggleGroup>
        </div>
      </div>
      <Button
        className="sticky bottom-0"
        variant={"default"}
        onClick={handleSaveEdits}
        disabled={saveDisabled || saveLoading}
      >
        {saveLoading ? <ReloadIcon className="w-6 h-6 animate-spin" /> : h("save")}
      </Button>
    </div>
  );
}
