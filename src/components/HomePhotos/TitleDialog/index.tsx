import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useContext, useState } from "react";
import { HomeContext } from "@/context/HomeContext";
import { LocaleContext } from "@/context/LocaleContext";
import { I18nProviderClient } from "@/locales/client";
import Title from "@/app/[locale]/homes/[homeId]/edit/title";

export default function TitleDialog() {
  const { home } = useContext(HomeContext);
  const { defaultLanguage } = useContext(LocaleContext);
  const [isTitleModalOpen, setTitleModalOpen] = useState(false);
  return (
    <Dialog open={isTitleModalOpen} onOpenChange={setTitleModalOpen}>
      <DialogTrigger asChild>
        <h1
          className={`flex items-center justify-center hover:cursor-pointer border-2 p-2 border-primary animate-pulse rounded-md bg-primary/10`}
          onClick={() => {
            setTitleModalOpen(true);
          }}
        >
          {home.title}
        </h1>
      </DialogTrigger>
      <DialogContent className="w-[90%] px-0 sm:px-2 md:px-6">
        <I18nProviderClient locale={defaultLanguage}>
          <Title />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
