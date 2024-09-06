"use client";

import { useScopedI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { typesMap } from "@/lib/sellFlowData";
import { Checkbox } from "@/components/ui/checkbox";
import { typeIcons } from "@/components/Icons/typeIcons";
import { useTheme } from "next-themes";

interface CategoriesObject {
  id: string;
  translation: string;
  checked: boolean;
}

interface Props {
  selectedTypes: string[];
  setSelectedTypes: (selectedIds: string[]) => void;
}

export default function Categories({ selectedTypes, setSelectedTypes }: Props) {
  const t = useScopedI18n("sell.type");
  const [categoriesObject, setCategoriesObject] = useState<CategoriesObject[]>([]);
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    if (t) {
      const newCategoriesObject = Array.from({ length: 17 }, (_, index) => ({
        id: typesMap[index].id,
        translation: t(`options.${index}` as keyof typeof t),
        checked: selectedTypes.includes(typesMap[index].id),
      }));

      setCategoriesObject(newCategoriesObject);
    }
  }, [t]);

  const handleCheckedChange = (index: number) => {
    const updatedCategoriesObject = categoriesObject.map((feature, idx) =>
      idx === index ? { ...feature, checked: !feature.checked } : feature
    );

    setCategoriesObject(updatedCategoriesObject);

    // Update the selected types
    const selectedIds = updatedCategoriesObject.filter((feature) => feature.checked).map((feature) => feature.id);

    setSelectedTypes(selectedIds);
  };

  useEffect(() => {
    // resync selectedFeatures with the selectedFeatures in the parent component
    const newCategoriesObject = Array.from({ length: 17 }, (_, index) => ({
      id: typesMap[index].id,
      translation: t(`options.${index}` as keyof typeof t),
      checked: selectedTypes.includes(typesMap[index].id),
    }));
    setCategoriesObject(newCategoriesObject);
  }, [selectedTypes]);

  return (
    <>
      {categoriesObject.map((type, index) => {
        const TypeIcon = typeIcons[type.id]; // Get the corresponding icon
        return (
          <div
            key={type.id}
            className="flex items-center justify-between gap-3 w-full cursor-pointer hover:bg-secondary rounded-sm p-2 px-3"
            onClick={() => {
              handleCheckedChange(index);
            }}
          >
            {TypeIcon && <TypeIcon color={theme === "dark" ? "white" : "black"} width={36} height={36} />}
            <div className="flex items-center text-sm gap-3 w-full">{type.translation}</div>

            <Checkbox id={type.id} className="h-4 w-4 cursor-pointer" key={type.id} checked={type.checked} />
          </div>
        );
      })}
    </>
  );
}
