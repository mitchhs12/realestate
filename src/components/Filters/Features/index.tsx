"use client";

import { useScopedI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { features } from "@/lib/sellFlowData";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

interface FeaturesObject {
  id: string;
  translation: string;
  checked: boolean;
}

interface Props {
  selectedFeatures: string[];
  setSelectedFeatures: (selectedIds: string[]) => void;
}

export default function Categories({ selectedFeatures, setSelectedFeatures }: Props) {
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
        }
        return null;
      })}
    </>
  );
}
