"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Switch } from "@/components/ui/switch";
import CounterComponent from "@/components/CounterComponent";
import { Input } from "@/components/ui/input";
import { LocaleContext } from "@/context/LocaleContext";
import NumberInput from "@/components/ui/numberinput";
import { formatNumber } from "@/lib/utils";
import { Footprints, LandPlot, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/locales/client";
import { HomeContext } from "@/context/HomeContext";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Capacity() {
  const ftConversion = 10.76391042;

  const { numerals } = useContext(LocaleContext);
  const { editedHome, setEditedHome, saveLoading, handleSaveEdits } = useContext(HomeContext);

  const [sqSize, setSqSize] = useState<number>(editedHome?.areaSqm);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [sqLabel, setSqLabel] = useState<string>(formatNumber(editedHome?.areaSqm, numerals));
  const [metresOn, setMetresOn] = useState(true);
  const [humanCapacity, setHumanCapacity] = useState<number>(editedHome?.capacity);
  const t = useScopedI18n("sell.capacity");
  const h = useScopedI18n("homes");

  useEffect(() => {
    if (editedHome && sqSize > 0) {
      setSaveDisabled(false);
      setEditedHome({
        ...editedHome,
        areaSqm: sqSize,
        capacity: humanCapacity,
      });
    } else if (sqSize === 0) {
      setSaveDisabled(true);
    }
  }, [sqSize, humanCapacity]);

  const handleSqSizeChange = ({ value, number }: { value: string; number: number }) => {
    if (metresOn) {
      setSqLabel(value);
      setSqSize(number);
    } else {
      setSqLabel(value);
      setSqSize(number / ftConversion);
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full justify-center items-center h-full">
          <div className="flex flex-col pb-4">
            <div className="flex items-center justify-center py-3">
              <h1 className="flex items-center text-3xl">{t("title")}</h1>
            </div>
            <div className="flex flex-col px-8 mt-5">
              <h3 className="text-lg w-full">{t("subtitle")}</h3>
            </div>
          </div>
          <div className="flex flex-col h-full items-center w-full text-lg md:text-xl xl:text-2xl overflow-auto">
            <div className="flex w-full justify-center">{t("size")}</div>
            <div className="flex flex-col w-full h-full justify-start items-center gap-3">
              <div className="flex flex-col pt-8 w-full justify-between items-center">
                <div className="flex w-full h-full justify-center items-center px-2">
                  <NumberInput
                    className="w-full max-w-[400px]"
                    component={Input}
                    value={sqLabel}
                    locales={numerals}
                    onNumberFormat={(e: any) => handleSqSizeChange(e.detail)}
                    placeholder={metresOn ? t("m-placeholder") : t("ft-placeholder")}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <Button
                  className="flex items-center gap-3"
                  variant={"outline"}
                  size={"default"}
                  onClick={() => {
                    if (metresOn) {
                      setSqLabel(formatNumber(Math.round(sqSize * ftConversion), numerals));
                    } else {
                      setSqLabel(formatNumber(Math.round(sqSize), numerals));
                    }
                    setMetresOn(!metresOn);
                  }}
                >
                  {metresOn ? <Footprints size={18} strokeWidth={1.25} /> : <Ruler size={18} strokeWidth={1.25} />}
                  {metresOn ? t("change-to-feet") : t("change-to-metres")}
                </Button>
              </div>
            </div>

            <div className="flex justify-center gap-3 items-center">
              <div className="flex items-center">
                <LandPlot size={20} strokeWidth={1} />
              </div>
              <div className="flex flex-col">
                {sqLabel} {metresOn ? t("units.m") : t("units.ft")}
              </div>
            </div>
            <div className="flex flex-col h-full w-full justify-center text-sm md:text-md lg:text-lg xl:text-xl items-center gap-4 md:gap-8">
              <h3 className="flex ">{t("capacity")}</h3>
              <div className="flex justify-center items-center gap-4 md:gap-8">
                <CounterComponent state={humanCapacity} setState={setHumanCapacity} numerals={numerals} />
              </div>
            </div>
          </div>
        </div>
        <Button className="flex" variant={"default"} onClick={handleSaveEdits} disabled={saveDisabled || saveLoading}>
          {saveLoading ? <ReloadIcon className="w-6 h-6 animate-spin" /> : h("save")}
        </Button>
      </div>
    </div>
  );
}
