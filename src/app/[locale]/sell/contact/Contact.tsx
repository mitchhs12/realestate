"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Input } from "@/components/ui/input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { isValidEmail } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { PhoneInput } from "@/components/ui/phone-input";
import { HomeType } from "@/lib/validations";

interface Props {
  user: User;
  currentHome: HomeType | null;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
  title: string;
  subtitle: string;
  name_text: string;
  name_placeholder: string;
  email_text: string;
  email_placeholder: string;
  mobile_text: string;
  mobile_placeholder: string;
  mobile_check: string;
  phoneList: any;
  noCountry: string;
  searchCountry: string;
}

export default function Contact({
  user,
  currentHome,
  sellFlatIndex,
  sellFlowIndices,
  stepPercentage,
  title,
  subtitle,
  name_text,
  name_placeholder,
  email_text,
  email_placeholder,
  mobile_text,
  mobile_placeholder,
  mobile_check,
  phoneList,
  noCountry,
  searchCountry,
}: Props) {
  const {
    setSellFlowFlatIndex,
    setSellFlowIndices,
    setStepPercentage,
    setNextLoading,
    setPrevLoading,
    setNewHome,
    setCurrentHome,
    setIsMyPhone,
    isMyPhone,
    setNextDisabled,
  } = useContext(SellContext);

  const [propertyOwnerName, setPropertyOwnerName] = useState<string>(
    currentHome?.contactName ? currentHome.contactName : user.name || ""
  );
  const [propertyOwnerEmail, setPropertyOwnerEmail] = useState<string>(
    currentHome?.contactEmail ? currentHome.contactEmail : user.email || ""
  );
  const [propertyOwnerPhone, setPropertyOwnerPhone] = useState<string | undefined>(
    currentHome?.contactPhone ? currentHome.contactPhone : user.phoneNumber || ""
  );

  useEffect(() => {
    if (
      currentHome &&
      propertyOwnerPhone &&
      propertyOwnerEmail &&
      propertyOwnerName &&
      isValidEmail(propertyOwnerEmail) &&
      isValidPhoneNumber(propertyOwnerPhone)
    ) {
      setNextDisabled(false);
      setNewHome({
        ...currentHome,
        contactName: propertyOwnerName,
        contactEmail: propertyOwnerEmail,
        contactPhone: propertyOwnerPhone,
      });
    } else {
      setNextDisabled(true);
    }
  }, [propertyOwnerName, propertyOwnerEmail, propertyOwnerPhone]);

  useEffect(() => {
    setCurrentHome(currentHome);
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setNextLoading(false);
    setPrevLoading(false);
    if (propertyOwnerPhone && propertyOwnerEmail && propertyOwnerName) {
      setNextDisabled(false);
    } else {
      setNextDisabled(true);
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">{title}</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">{subtitle}</h3>
          </div>
        </div>
        <div className="flex h-full w-2/3 justify-center pt-12 gap-8">
          <div className="flex flex-col items-start gap-6 md:gap-12 w-full">
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <h2 className="flex font-medium text-right w-full md:w-2/12 justify-start md:justify-end">{name_text}</h2>
              <div className="flex w-full">
                <Input
                  value={propertyOwnerName}
                  onChange={(e) => setPropertyOwnerName(e.target.value)}
                  placeholder={name_placeholder}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <h2 className="flex font-medium text-right w-full md:w-2/12 justify-start md:justify-end">
                {email_text}
              </h2>
              <div className="flex w-full">
                <Input
                  value={propertyOwnerEmail}
                  onChange={(e) => setPropertyOwnerEmail(e.target.value)}
                  placeholder={email_placeholder}
                />
              </div>
            </div>
            <div className="flex-col w-full h-full">
              <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                <h2 className="flex font-medium text-right w-full md:w-2/12 justify-start md:justify-end">
                  {mobile_text}
                </h2>
                <div className="flex w-full items-center">
                  <PhoneInput
                    value={propertyOwnerPhone}
                    onChange={setPropertyOwnerPhone}
                    labels={phoneList}
                    placeholder={mobile_placeholder}
                    noCountry={noCountry}
                    searchCountry={searchCountry}
                  />
                </div>
              </div>
              {user?.phoneNumber !== propertyOwnerPhone && (
                <div className="flex flex-row justify-center md:justify-end items-center gap-2 w-full pt-3">
                  <h2 className="flex font-light text-sm xs:text-base text-right text-nowrap">{mobile_check}</h2>
                  <div className="flex items-center">
                    <Switch checked={isMyPhone} onCheckedChange={() => setIsMyPhone(!isMyPhone)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
