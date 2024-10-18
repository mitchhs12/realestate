"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Input } from "@/components/ui/input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { isValidEmail } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { PhoneInput } from "@/components/ui/phone-input";
import { LocaleContext } from "@/context/LocaleContext";
import { HomeContext } from "@/context/HomeContext";
import { useScopedI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { getPhoneLocale } from "@/lib/utils";

export default function Contact() {
  const { editedHome, setEditedHome, saveLoading, handleSaveEdits } = useContext(HomeContext);
  const { user, defaultLanguage } = useContext(LocaleContext);

  const [propertyOwnerName, setPropertyOwnerName] = useState<string>(editedHome.contactName!);
  const [propertyOwnerEmail, setPropertyOwnerEmail] = useState<string>(editedHome.contactEmail!);
  const [propertyOwnerPhone, setPropertyOwnerPhone] = useState<string>(editedHome.contactPhone!);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [phoneLabels, setPhoneLabels] = useState<any>(null);

  const t = useScopedI18n("sell.contact");
  const h = useScopedI18n("homes");

  useEffect(() => {
    const fetchPhoneLabels = async () => {
      const labels = await getPhoneLocale(defaultLanguage);
      setPhoneLabels(labels);
    };

    fetchPhoneLabels();
  }, [defaultLanguage]);

  useEffect(() => {
    if (
      editedHome &&
      propertyOwnerPhone &&
      propertyOwnerEmail &&
      propertyOwnerName &&
      isValidEmail(propertyOwnerEmail) &&
      isValidPhoneNumber(propertyOwnerPhone)
    ) {
      setSaveDisabled(false);
      setEditedHome({
        ...editedHome,
        contactName: propertyOwnerName,
        contactEmail: propertyOwnerEmail,
        contactPhone: propertyOwnerPhone,
      });
    } else {
      setSaveDisabled(true);
    }
  }, [propertyOwnerName, propertyOwnerEmail, propertyOwnerPhone]);

  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="flex flex-col w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{t("title")}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{t("subtitle")}</h3>
          </div>
        </div>
        <div className="flex h-full w-2/3 justify-center pt-12 gap-8">
          <div className="flex flex-col items-start gap-6 md:gap-12 w-full">
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <h2 className="flex font-medium text-right w-full md:w-2/12 justify-start md:justify-end">{t("name")}</h2>
              <div className="flex w-full">
                <Input
                  value={propertyOwnerName}
                  onChange={(e) => setPropertyOwnerName(e.target.value)}
                  placeholder={t("name-placeholder")}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <h2 className="flex font-medium text-right w-full md:w-2/12 justify-start md:justify-end">
                {t("email")}
              </h2>
              <div className="flex w-full">
                <Input
                  value={propertyOwnerEmail}
                  onChange={(e) => setPropertyOwnerEmail(e.target.value)}
                  placeholder={t("email-placeholder")}
                />
              </div>
            </div>
            <div className="flex-col w-full h-full">
              <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                <h2 className="flex font-medium text-right w-full md:w-2/12 justify-start md:justify-end">
                  {t("mobile")}
                </h2>
                <div className="flex w-full items-center">
                  {phoneLabels && (
                    <PhoneInput
                      value={propertyOwnerPhone}
                      onChange={setPropertyOwnerPhone}
                      labels={phoneLabels}
                      placeholder={t("mobile-placeholder")}
                      noCountry={t("no-country")}
                      searchCountry={t("search-country")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button
          className="sticky bottom-0"
          variant={"default"}
          onClick={handleSaveEdits}
          disabled={saveDisabled || saveLoading}
        >
          {saveLoading ? <ReloadIcon className="w-6 h-6 animate-spin" /> : h("save")}
        </Button>
      </div>
    </div>
  );
}
