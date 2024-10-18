import { useContext, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { I18nProviderClient } from "@/locales/client";
import Rooms from "@/app/[locale]/homes/[homeId]/edit/rooms";
import { HomeContext } from "@/context/HomeContext";
import { BedDouble, Bath, Sofa, CookingPot } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function RoomsDialog({
  roomsTitle,
  bedroomsText,
  bathroomsText,
  livingroomsText,
  kitchensText,
}: {
  roomsTitle: string;
  bedroomsText: { single: string; plural: string };
  bathroomsText: { single: string; plural: string };
  livingroomsText: { single: string; plural: string };
  kitchensText: { single: string; plural: string };
}) {
  const { home, currentType } = useContext(HomeContext);
  const { numerals, defaultLanguage } = useContext(LocaleContext);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full hover:cursor-pointer border-2 border-primary animate-pulse rounded-lg bg-primary/10">
          <div className="flex flex-col w-full sm:w-3/4">
            <div className="text-lg sm:text-xl mb-3">{roomsTitle}</div>
            <div className="flex flex-col w-full gap-3 pl-1">
              <div className="flex gap-3 items-center">
                <BedDouble size={18} strokeWidth={1.5} />
                <span className="w-[1rem]">{formatNumber(home.bedrooms, numerals)}</span>
                <span>{home.bedrooms !== 1 ? bedroomsText.plural : bedroomsText.single}</span>
              </div>
              <div className="flex gap-3 items-center">
                <Bath size={18} strokeWidth={1.5} />
                <span className="w-[1rem]">{formatNumber(home.bathrooms, numerals)}</span>
                <span>{home.bathrooms !== 1 ? bathroomsText.plural : bathroomsText.single}</span>
              </div>
              <div className="flex gap-3 items-center">
                <Sofa size={18} strokeWidth={1.5} />
                <span className="w-[1rem]">{formatNumber(home.livingrooms, numerals)}</span>
                <span>{home.livingrooms !== 1 ? livingroomsText.plural : livingroomsText.single}</span>
              </div>
              <div className="flex gap-3 items-center">
                <CookingPot size={18} strokeWidth={1.5} />
                <span className="w-[1rem]">{formatNumber(home.kitchens, numerals)}</span>
                <span>{home.kitchens !== 1 ? kitchensText.plural : kitchensText.single}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-6xl h-[80%] overflow-auto">
        <I18nProviderClient locale={defaultLanguage}>
          <Rooms />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
