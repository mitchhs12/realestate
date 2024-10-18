"use client";
import { useContext, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import CounterComponent from "@/components/CounterComponent";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeContext } from "@/context/HomeContext";
import { useScopedI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Rooms() {
  const { editedHome, setEditedHome, saveLoading, handleSaveEdits } = useContext(HomeContext);
  const { numerals } = useContext(LocaleContext);

  const [bedrooms, setBedrooms] = useState(editedHome?.bedrooms);
  const [bathrooms, setBathrooms] = useState(editedHome?.bathrooms);
  const [livingrooms, setLivingrooms] = useState(editedHome?.livingrooms);
  const [kitchens, setKitchens] = useState(editedHome?.kitchens);

  const t = useScopedI18n("sell.rooms");
  const h = useScopedI18n("homes");

  useEffect(() => {
    if (editedHome) {
      setEditedHome({
        ...editedHome,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        livingrooms: livingrooms,
        kitchens: kitchens,
      });
    }
  }, [bedrooms, bathrooms, livingrooms, kitchens]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{t("title")}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{t("subtitle")}</h3>
          </div>
          <div className="flex h-full w-full justify-center">
            <div className="flex flex-col h-full justify-center items-center w-full text-lg md:text-xl xl:text-2xl">
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">{t("bedrooms")}</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={bedrooms} setState={setBedrooms} numerals={numerals} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">{t("bathrooms")}</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={bathrooms} setState={setBathrooms} numerals={numerals} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">{t("living-rooms")}</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={livingrooms} setState={setLivingrooms} numerals={numerals} />
                </div>
              </div>
              <Separator />
              <div className="flex h-full w-full justify-center items-center">
                <div className="flex w-full h-full items-center justify-start">{t("kitchens")}</div>
                <div className="flex w-full h-full items-center justify-end gap-4 md:gap-8">
                  <CounterComponent state={kitchens} setState={setKitchens} numerals={numerals} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button variant={"default"} onClick={handleSaveEdits} disabled={saveLoading}>
          {saveLoading ? <ReloadIcon className="w-6 h-6 animate-spin" /> : h("save")}
        </Button>
      </div>
    </div>
  );
}
