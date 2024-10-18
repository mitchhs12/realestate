"use client";
import { useContext, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { featureIcons } from "@/components/Icons/featureIcons";
import { HomeContext } from "@/context/HomeContext";
import { useScopedI18n } from "@/locales/client";
import { featuresMap } from "@/lib/sellFlowData";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export default function Features() {
  const { editedHome, setEditedHome, handleSaveEdits, saveLoading } = useContext(HomeContext);
  const [selection, setSelection] = useState<string[]>(editedHome.features);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const t = useScopedI18n("sell.features");
  const h = useScopedI18n("homes");

  useEffect(() => {
    if (editedHome && selection.length > 0) {
      setSaveDisabled(false);
      setEditedHome({ ...editedHome, features: selection });
    } else if (selection.length === 0) {
      setSaveDisabled(true);
    }
  }, [selection]);

  const handleValueChange = (value: string[]) => {
    if (value.includes("None")) {
      setSelection(["None"]);
    } else {
      setSelection(value.filter((v) => v !== "None"));
    }
  };

  const options = Array.from({ length: 17 }, (_, index) => ({
    id: featuresMap[index].id,
    name: featuresMap[index].name,
    translation: t(`options.${index}` as keyof typeof t),
  }));

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col pb-4">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{t("title")}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{t("subtitle")}</h3>
          </div>
        </div>
        <div className="w-full h-full justify-center items-center px-4 sm:px-8 overflow-auto">
          <ToggleGroup type="multiple" value={selection} defaultValue={selection} onValueChange={handleValueChange}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8 items-center justify-center">
              {options.map((feature, index) => {
                const IconComponent = featureIcons[feature.id as keyof typeof featureIcons]; // Get the corresponding icon
                return (
                  <ToggleGroupItem
                    variant={"outline"}
                    key={index}
                    value={feature.name}
                    className="flex px-2 gap-3 justify-center items-center h-[50px] md:h-[80px] xl:h-[120px] text-xs md:text-sm lg:text-md"
                  >
                    <div className="flex lg:w-1/2 justify-start lg:justify-center lg:items-center items-start">
                      {IconComponent && (
                        <div className="flex justify-center items-center">
                          <IconComponent color="gray" width={40} height={40} />
                        </div>
                      )}
                    </div>
                    <div className="flex w-1/2 h-full">
                      <div className="flex w-full h-full items-center justify-start text-start">
                        {feature.translation}
                      </div>
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
