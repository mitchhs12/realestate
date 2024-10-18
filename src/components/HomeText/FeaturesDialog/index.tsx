import { Button } from "@/components/ui/button";
import { useState, useContext } from "react";
import { HomeContext } from "@/context/HomeContext";
import { useTheme } from "next-themes";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { I18nProviderClient } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";
import Features from "@/app/[locale]/homes/[homeId]/edit/features";
import { featureIcons } from "@/components/Icons/featureIcons";

export default function FeaturesDialog({ featuresTitle }: { featuresTitle: string }) {
  const { matchingFeatures } = useContext(HomeContext);
  const { defaultLanguage } = useContext(LocaleContext);

  const { resolvedTheme: theme } = useTheme();

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  return (
    <Dialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col h-full hover:cursor-pointer border-2 p-2 border-primary animate-pulse rounded-md bg-primary/10">
          <div className="text-lg sm:text-xl mb-3">{featuresTitle}</div>
          <div className="gap-3 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 text-sm sm:text-lg">
            {matchingFeatures.map((feature, index) => {
              const FeatureIcon = featureIcons[feature.id as keyof typeof featureIcons]; // Get the corresponding icon

              return (
                FeatureIcon && (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex">
                      <FeatureIcon color={theme === "dark" ? "#FFFFFF" : "#000000"} width={25} height={25} />
                    </div>
                    <div className="flex text-xs sm:text-sm">{feature.translation}</div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-6xl max-h-[80%] px-0 overflow-auto">
        <I18nProviderClient locale={defaultLanguage}>
          <Features />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
