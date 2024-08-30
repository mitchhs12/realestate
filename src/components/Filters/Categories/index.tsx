"use client";

import { useScopedI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { types } from "@/lib/sellFlowData";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface CategoriesObject {
  id: string;
  translation: string;
  checked: boolean;
}

interface Props {
  selectedTypes: string[];
  setSelectedTypes: (selectedIds: string[]) => void;
  modal?: boolean;
}

export default function Categories({ selectedTypes, setSelectedTypes, modal }: Props) {
  const t = useScopedI18n("sell.type");
  const [categoriesObject, setCategoriesObject] = useState<CategoriesObject[]>([]);

  useEffect(() => {
    if (t) {
      const newCategoriesObject = Array.from({ length: 17 }, (_, index) => ({
        id: types[index],
        translation: t(`options.${index}` as keyof typeof t),
        checked: selectedTypes.includes(types[index]),
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
      id: types[index],
      translation: t(`options.${index}` as keyof typeof t),
      checked: selectedTypes.includes(types[index]),
    }));
    setCategoriesObject(newCategoriesObject);
  }, [selectedTypes]);

  return (
    <>
      {categoriesObject.map((feature, index) => {
        return (
          <div
            className="flex items-center justify-between gap-3 w-full cursor-pointer hover:bg-secondary rounded-sm p-2 px-3"
            onClick={() => {
              handleCheckedChange(index);
            }}
          >
            <div className="flex items-center text-sm gap-3 w-full">{feature.translation}</div>

            <Checkbox id={feature.id} className="h-4 w-4 cursor-pointer" key={feature.id} checked={feature.checked} />
          </div>
        );
      })}
    </>
  );
}
