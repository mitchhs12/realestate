import { useContext, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { I18nProviderClient } from "@/locales/client";
import Capacity from "@/app/[locale]/homes/[homeId]/edit/capacity";
import { Button } from "@/components/ui/button";
import { HomeContext } from "@/context/HomeContext";
import { LandPlot, Ruler, Footprints, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function CapacityDialog({
  capacityTitle,
  capacityText,
  sizeTitle,
  units,
  sqSize,
  feet,
}: {
  capacityTitle: string;
  capacityText: { single: string; plural: string };
  sizeTitle: string;
  units: { m: string; ft: string };
  sqSize: number;
  feet: boolean;
}) {
  const { home, currentType } = useContext(HomeContext);
  const { numerals, defaultLanguage } = useContext(LocaleContext);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full hover:cursor-pointer border-2 border-primary animate-pulse rounded-lg bg-primary/10">
          <div className="flex flex-col gap-6">
            {currentType.id !== "warehouse" && currentType.id !== "land" && (
              <div className="flex flex-col gap-3">
                <div className="text-lg sm:text-xl">{capacityTitle}</div>
                <div className="flex items-center gap-3 pl-1">
                  <Users size={20} strokeWidth={1.5} />
                  <div className="flex items-center gap-1">
                    <span>{formatNumber(home.capacity, numerals)}</span>
                    {home.capacity === 0 ? capacityText.single : capacityText.plural}
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-5">
                <div className="flex items-center text-lg sm:text-xl">{sizeTitle}</div>
              </div>
              <div className="flex gap-3 items-center pl-1">
                <div className="flex">
                  <LandPlot size={20} strokeWidth={1.25} />
                </div>
                <div className="flex flex-col">
                  {formatNumber(sqSize, numerals)} {feet ? units.ft : units.m}
                </div>
              </div>
              <div className="flex items-center">
                <Button className="flex items-center gap-3" variant={"secondary"} size={"default"}>
                  {feet ? <Ruler size={18} strokeWidth={1.25} /> : <Footprints size={18} strokeWidth={1.25} />}
                  {feet ? units.m : units.ft}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-6xl h-[80%] overflow-auto">
        <I18nProviderClient locale={defaultLanguage}>
          <Capacity />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
