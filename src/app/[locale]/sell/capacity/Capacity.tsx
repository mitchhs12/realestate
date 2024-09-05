"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Switch } from "@/components/ui/switch";
import CounterComponent from "@/components/CounterComponent";
import { Input } from "@/components/ui/input";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeType } from "@/lib/validations";
import NumberInput from "@/components/ui/numberinput";
import { formatNumber } from "@/lib/utils";
import { Footprints, LandPlot, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  size: string;
  capacity: string;
  m: string;
  ft: string;
  mPlaceholder: string;
  ftPlaceholder: string;
  changeToFeet: string;
  changeToMetres: string;
}

export default function Capacity({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  size,
  capacity,
  m,
  ft,
  mPlaceholder,
  ftPlaceholder,
  changeToFeet,
  changeToMetres,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    setCurrentHome,
    setNewHome,
    setNextDisabled,
  } = useContext(SellContext);
  const ftConversion = 10.76391042;

  const { numerals } = useContext(LocaleContext);

  const [sqSize, setSqSize] = useState<number>(currentHome?.areaSqm ? currentHome?.areaSqm : 0);
  const [sqLabel, setSqLabel] = useState<string>(
    currentHome?.areaSqm ? formatNumber(currentHome?.areaSqm, numerals) : ""
  );
  const [metresOn, setMetresOn] = useState(true);
  const [humanCapacity, setHumanCapacity] = useState<number>(currentHome?.capacity ? currentHome?.capacity : 0);
  const [sqFeet, setSqFeet] = useState<number>(currentHome?.areaSqm ? currentHome?.areaSqm * ftConversion : 0);

  useEffect(() => {
    if (currentHome && sqSize > 0 && humanCapacity > 0) {
      setNextDisabled(false);
      setNewHome({
        ...currentHome,
        areaSqm: sqSize,
        capacity: humanCapacity,
      });
    } else if (sqSize === 0 || humanCapacity === 0) {
      setNextDisabled(true);
    }
  }, [sqSize, humanCapacity]);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    if (sqSize > 0 || humanCapacity > 0) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
    setPrevLoading(false);
  }, []);

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
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full justify-center items-center h-full gap-y-8">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
          <div className="flex flex-col h-full items-center w-[80vw] md:w-[60vw] xl:w-[40vw] text-lg md:text-xl xl:text-2xl py-8">
            <div className="flex w-full justify-center">{size}</div>
            <div className="flex flex-col w-full h-full">
              <div className="flex flex-col md:flex-row h-1/2 pt-10 w-full justify-between items-center">
                <div className="flex w-full h-full justify-center items-center">
                  <div className="flex w-full h-full justify-start items-center gap-4">
                    <NumberInput
                      component={Input}
                      value={sqLabel}
                      locales={numerals}
                      onNumberFormat={(e: any) => handleSqSizeChange(e.detail)}
                      placeholder={metresOn ? mPlaceholder : ftPlaceholder}
                    />
                    <div className="flex justify-start items-start">{metresOn ? m : ft}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center w-full">
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
                  {metresOn ? changeToFeet : changeToMetres}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <div className="flex">
                  <LandPlot size={20} strokeWidth={1} />
                </div>
                <div className="flex flex-col">
                  {sqLabel} {metresOn ? m : ft}
                </div>
              </div>
            </div>
            <div className="flex flex-col h-full w-full justify-center items-center gap-4 md:gap-8">
              <h3 className="flex ">{capacity}</h3>
              <div className="flex justify-center items-center gap-4 md:gap-8">
                <CounterComponent state={humanCapacity} setState={setHumanCapacity} numerals={numerals} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
