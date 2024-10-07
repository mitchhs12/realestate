"use client";
import { Button } from "@/components/ui/button";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { Languages } from "lucide-react";
import { updateLanguage } from "@/app/[locale]/settings/actions";
import { LanguageType } from "@/lib/validations";

export default function ChangeLanguage({ changeLanguageText }: { changeLanguageText: string }) {
  const changeLocale = useChangeLocale();

  const handleChangeLang = async (newLang: LanguageType) => {
    await updateLanguage({ language: newLang });
    changeLocale("en");
  };

  return (
    <Button onClick={() => handleChangeLang("en")} className="flex w-full items-center justify-center gap-3">
      <Languages size={20} />
      {changeLanguageText}
    </Button>
  );
}
