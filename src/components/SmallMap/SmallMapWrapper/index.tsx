"use client";
import { HomeContext } from "@/context/HomeContext";
import { useContext, useState } from "react";
import MapComponent from "@/components/SmallMap";
import { I18nProviderClient } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Location from "@/app/[locale]/homes/[homeId]/edit/location";

export default function SmallMapWrapper() {
  const { home, editMode } = useContext(HomeContext);
  const { defaultLanguage } = useContext(LocaleContext);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  return editMode ? (
    <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
      <DialogTrigger asChild>
        <div className="flex w-full h-full hover:cursor-pointer border-2 border-primary animate-pulse rounded-md bg-primary/10">
          <MapComponent
            currentHome={home}
            coordinates={{ long: home.longitude, lat: home.latitude }}
            disabled={true}
            usePin={home.exactLocation}
            editMode={true}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-6xl h-[80%] overflow-auto">
        <I18nProviderClient locale={defaultLanguage}>
          <Location />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  ) : (
    <MapComponent
      currentHome={home}
      coordinates={{ long: home.longitude, lat: home.latitude }}
      disabled={true}
      usePin={home.exactLocation}
    />
  );
}
