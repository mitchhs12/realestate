"use client";

import { useState, useContext, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AIContent from "@/components/InteriorAI/Content";
import { I18nProviderClient } from "@/locales/client";
import { LocaleContext } from "@/context/LocaleContext";
import { QueryContext } from "@/context/QueryContext";
import { usePathname } from "next/navigation";
import PricingDialog from "@/components/StartPageContent/Dialog";

interface Props {
  imageUrl: string;
}

export default function InteriorAI({ imageUrl }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [openPricing, setOpenPricing] = useState(false);
  const { defaultLanguage, user, sessionLoading } = useContext(LocaleContext);
  const { openLogInModal } = useContext(QueryContext);

  const pathname = usePathname();

  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${defaultLanguage}${pathname}`
      : `https://www.vivaideal.com/${defaultLanguage}${pathname}`;

  const handleOpen = () => {
    if (!sessionLoading) {
      if (!user) {
        openLogInModal();
      } else {
        setModalOpen(!modalOpen);
      }
    }
  };

  useEffect(() => {
    if (openPricing) {
      setModalOpen(false);
    }
  }, [openPricing]);

  return (
    <>
      <Dialog open={modalOpen} onOpenChange={handleOpen}>
        <DialogTrigger>
          <Button
            disabled={sessionLoading}
            variant="default"
            className="flex justify-center items-center gap-3 bg-purple-600 hover:bg-purple-600/90"
          >
            <span className="flex justify-center items-center gap-3">
              <Sparkles size={20} />
              <p>AI Studio</p>
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="flex flex-col justify-start items-center w-full h-full max-w-[90%] max-h-[85%] px-0 pb-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <I18nProviderClient locale={defaultLanguage}>
            <AIContent imageUrl={imageUrl} setOpenPricing={setOpenPricing} />
          </I18nProviderClient>
        </DialogContent>
      </Dialog>
      <Dialog open={openPricing} onOpenChange={setOpenPricing}>
        <DialogContent className="flex flex-col py-1 px-0 w-[90%] max-w-8xl h-[90%] overflow-y-auto">
          <PricingDialog redirectUrl={redirectUrl} />
        </DialogContent>
      </Dialog>
    </>
  );
}
