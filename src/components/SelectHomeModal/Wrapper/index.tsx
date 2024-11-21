"use client";

import { I18nProviderClient } from "@/locales/client";
import { HomeType, LanguageType } from "@/lib/validations";
import { User } from "next-auth";
import { Modal } from "@/components/SelectHomeModal/Modal";
import SellFlowPage from "@/app/[locale]/sell/SellFlowPage";
import { useEffect, useState } from "react";

interface Props {
  locale: LanguageType;
  currentHome: HomeType | null;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  sellFlatIndex: number;
  stepPercentage: number[];
  sellFlowText: {
    title: string;
    titleContinue: string;
    step1: string;
    step1Sub: string;
    step2: string;
    step2Sub: string;
    step3: string;
    step3Sub: string;
    completed: string;
  };
  unfinishedHomes: HomeType[];
  user: User;
}

export default function LockedLogin({
  user,
  currentHome,
  sellFlowIndices,
  sellFlatIndex,
  stepPercentage,
  locale,
  sellFlowText,
  unfinishedHomes,
}: Props) {
  const [modalOpen, setModalOpen] = useState<boolean>(unfinishedHomes.length > 0 ? true : false);

  useEffect(() => {
    if (unfinishedHomes.length === 0) {
      setModalOpen(false);
    }
  }, [unfinishedHomes]);

  return (
    <div className="w-full h-full relative">
      <div className="flex absolute z-200 w-full h-full">
        <I18nProviderClient locale={locale}>
          <Modal unfinishedHomes={unfinishedHomes} user={user} modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </I18nProviderClient>
      </div>
      <div className="w-full h-full relative">
        <SellFlowPage
          currentHome={currentHome}
          sellFlowIndices={sellFlowIndices}
          sellFlatIndex={sellFlatIndex}
          stepPercentage={stepPercentage}
          locale={locale}
          title={sellFlowText.title}
          titleContinue={sellFlowText.titleContinue}
          step1={sellFlowText.step1}
          step1Sub={sellFlowText.step1Sub}
          step2={sellFlowText.step2}
          step2Sub={sellFlowText.step2Sub}
          step3={sellFlowText.step3}
          step3Sub={sellFlowText.step3Sub}
          completed={sellFlowText.completed}
          unfinishedHomes={unfinishedHomes}
          setModalOpen={setModalOpen}
        />
      </div>
    </div>
  );
}
