"use client";

import { useScopedI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { features } from "@/lib/sellFlowData";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface FeaturesObject {
  id: string;
  translation: string;
  checked: boolean;
}

interface Props {
  selectedFeatures: string[];
  setSelectedFeatures: (selectedIds: string[]) => void;
  modal?: boolean;
}

export default function Categories({ selectedFeatures, setSelectedFeatures, modal }: Props) {
  const t = useScopedI18n("sell.features");
  const [featuresObject, setFeaturesObject] = useState<FeaturesObject[]>([]);

  useEffect(() => {
    if (t) {
      const newFeaturesObject = Array.from({ length: 26 }, (_, index) => ({
        id: features[index],
        translation: t(`options.${index}` as keyof typeof t),
        checked: selectedFeatures.includes(features[index]),
      }));

      setFeaturesObject(newFeaturesObject);
    }
  }, [t]);

  const handleCheckedChange = (index: number) => {
    const updatedFeaturesObject = featuresObject.map((feature, idx) =>
      idx === index ? { ...feature, checked: !feature.checked } : feature
    );

    setFeaturesObject(updatedFeaturesObject);

    // Update the selected types
    const selectedIds = updatedFeaturesObject.filter((feature) => feature.checked).map((feature) => feature.id);

    setSelectedFeatures(selectedIds);
  };

  useEffect(() => {
    // resync selectedFeatures with the selectedFeatures in the parent component
    const newFeaturesObject = Array.from({ length: 26 }, (_, index) => ({
      id: features[index],
      translation: t(`options.${index}` as keyof typeof t),
      checked: selectedFeatures.includes(features[index]),
    }));
    setFeaturesObject(newFeaturesObject);
  }, [selectedFeatures]);

  return (
    <>
      {featuresObject.map((feature, index) => {
        if (index !== 0) {
          return (
            <div
              key={feature.id}
              className="flex items-center justify-between gap-3 w-full cursor-pointer hover:bg-secondary rounded-sm p-2 px-3"
              onClick={() => {
                handleCheckedChange(index);
              }}
            >
              <div className="flex items-center text-sm gap-3 w-full">{feature.translation}</div>

              <Checkbox id={feature.id} className="h-4 w-4 cursor-pointer" key={feature.id} checked={feature.checked} />
            </div>
          );
        } else return null;
      })}
    </>
  );
}
