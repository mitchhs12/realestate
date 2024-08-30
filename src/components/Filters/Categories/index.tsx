"use client";

import { useScopedI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { types } from "@/lib/sellFlowData";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

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
          <DropdownMenuCheckboxItem
            className="cursor-pointer"
            key={feature.id}
            checked={feature.checked}
            onCheckedChange={() => handleCheckedChange(index)}
            onSelect={(event) => event?.preventDefault()}
          >
            {feature.translation}
          </DropdownMenuCheckboxItem>
        );
      })}
    </>
  );
}
