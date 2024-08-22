"use client";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Switch } from "@/components/ui/switch";
import CounterComponent from "@/components/CounterComponent";
import { Input } from "@/components/ui/input";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeType } from "@/lib/validations";
import NumberInput from "@/components/ui/numberinput";

interface Props {
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  size: string;
  metres: string;
  feet: string;
  capacity: string;
  m: string;
  ft: string;
  mPlaceholder: string;
  ftPlaceholder: string;
}

export default function Capacity({
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  size,
  metres,
  feet,
  capacity,
  m,
  ft,
  mPlaceholder,
  ftPlaceholder,
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

  const [sqSize, setSqSize] = useState<number>(currentHome?.areaSqm ? currentHome?.areaSqm : 0);
  const [sqLabel, setSqLabel] = useState<string>("");
  const [metresOn, setMetresOn] = useState(true);
  const [humanCapacity, setHumanCapacity] = useState<number>(currentHome?.capacity ? currentHome?.capacity : 0);
  const [sqFeet, setSqFeet] = useState<number>(currentHome?.areaSqm ? currentHome?.areaSqm * ftConversion : 0);
  const { numerals } = useContext(LocaleContext);

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
            <div className="flex flex-col md:flex-row h-1/2 w-full justify-between items-center">
              <div className="flex w-full h-full justify-center items-center">
                <div className="flex w-4/5 h-full justify-start items-center gap-4">
                  <NumberInput
                    component={Input}
                    value={sqLabel}
                    locales={numerals}
                    onNumberFormat={(e: any) => handleSqSizeChange(e.detail)}
                    placeholder={metresOn ? mPlaceholder : ftPlaceholder}
                  />
                  <div className="flex justify-start items-center">{metresOn ? `${m}²` : `${ft}²`}</div>
                </div>
              </div>
              <div className="flex w-full h-full items-center justify-center gap-4">
                {metres}
                <Switch
                  checked={!metresOn}
                  onCheckedChange={() => {
                    if (metresOn) {
                      setSqLabel((sqSize * ftConversion).toString());
                    } else {
                      setSqLabel(sqSize.toString());
                    }
                    setMetresOn(!metresOn);
                  }}
                />
                {feet}
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
