"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Switch } from "@/components/ui/switch";
import CounterComponent from "@/components/CounterComponent";
import { Input } from "@/components/ui/input";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeType } from "@/lib/validations";

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
  const [sqSize, setSqSize] = useState(currentHome?.areaSqm ? currentHome?.areaSqm : 0);
  const [metresOn, setMetresOn] = useState(true);
  const [humanCapacity, setHumanCapacity] = useState<number>(currentHome?.capacity ? currentHome?.capacity : 0);
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

  const ftConversion = 10.76391042;

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

  const handleUnitSwitch = () => {
    if (sqSize > 0) {
      if (metresOn) {
        setSqSize(sqSize * ftConversion);
      } else {
        setSqSize(sqSize / ftConversion);
      }
    }
    setMetresOn(!metresOn);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(navigator.language).format(number);
  };

  const handleSqSizeChange = (e: any) => {
    const value = parseFloat(e.target.value.replace(/,/g, ""));
    setSqSize(isNaN(value) ? 0 : value);
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
                  <Input
                    type={"text"}
                    value={formatNumber(sqSize)}
                    onChange={handleSqSizeChange}
                    placeholder={
                      metresOn ? "Enter your property size in m² here..." : "Enter your property size in ft² here..."
                    }
                  />
                  <div className="flex justify-start items-center">{metresOn ? `${m}²` : `${ft}²`}</div>
                </div>
              </div>
              <div className="flex w-full h-full items-center justify-center gap-4">
                {metres} <Switch checked={!metresOn} onCheckedChange={handleUnitSwitch} /> {feet}
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
