"use client";

import { useScopedI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { features, featuresMap } from "@/lib/sellFlowData";
import { Checkbox } from "@/components/ui/checkbox";
import { featureIcons } from "@/components/Icons/featureIcons";
import { useTheme } from "next-themes";

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
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    if (t) {
      const newFeaturesObject = Array.from({ length: 26 }, (_, index) => ({
        id: featuresMap[index].id,
        translation: t(`options.${index}` as keyof typeof t),
        checked: selectedFeatures.includes(featuresMap[index].id),
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
      id: featuresMap[index].id,
      translation: t(`options.${index}` as keyof typeof t),
      checked: selectedFeatures.includes(featuresMap[index].id),
    }));
    setFeaturesObject(newFeaturesObject);
  }, [selectedFeatures]);

  return (
    <>
      {featuresObject.map((feature, index) => {
        if (index !== 0) {
          const FeatureIcon = featureIcons[feature.id];
          return (
            <div
              key={feature.id}
              className="flex items-center justify-between gap-3 w-full cursor-pointer hover:bg-secondary rounded-sm p-2 px-3"
              onClick={() => {
                handleCheckedChange(index);
              }}
            >
              {FeatureIcon && <FeatureIcon color={theme === "dark" ? "white" : "black"} width={36} height={36} />}
              <div className="flex items-center text-sm gap-3 w-full">{feature.translation}</div>

              <Checkbox id={feature.id} className="h-4 w-4 cursor-pointer" key={feature.id} checked={feature.checked} />
            </div>
          );
        } else return null;
      })}
    </>
  );
}
