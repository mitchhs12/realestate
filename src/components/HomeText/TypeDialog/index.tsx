import { Button } from "@/components/ui/button";
import { useState, useContext } from "react";
import { HomeContext } from "@/context/HomeContext";
import { typeIcons } from "@/components/Icons/typeIcons";
import { useTheme } from "next-themes";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { I18nProviderClient } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";
import Type from "@/app/[locale]/homes/[homeId]/edit/type";

export default function TypeDialog() {
  const { matchingTypes, currentType } = useContext(HomeContext);
  const { defaultLanguage } = useContext(LocaleContext);

  const { resolvedTheme: theme } = useTheme();

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const IconComponent = typeIcons[currentType.id as keyof typeof typeIcons]; // Get the corresponding icon

  return (
    <Dialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
      <DialogTrigger asChild>
        <div className="relative flex items-center justify-center h-12 w-full hover:cursor-pointer">
          <Button
            className="flex sm:absolute -left-3 items-center justify-center h-12 gap-2 pl-2 pr-2 disabled:opacity-70"
            variant={"ghost"}
            disabled={matchingTypes.length > 1 ? false : true}
          >
            <div className="flex items-center justify-center gap-2 border-2 p-2 border-primary animate-pulse rounded-md bg-primary/10">
              <div className="flex">
                <IconComponent color={theme === "dark" ? "white" : "black"} width={42} height={42} />
              </div>
              <h3 className="flex w-full text-3xl font-normal">{currentType.translation}</h3>
            </div>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-6xl max-h-[80%] px-0 overflow-auto">
        <I18nProviderClient locale={defaultLanguage}>
          <Type />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
