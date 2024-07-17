"use client";
import { User } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { SellContext } from "@/context/SellContext";
import { Input } from "@/components/ui/input";
import CustomPhoneInput from "@/components/CustomPhoneComponent";
import { isValidPhoneNumber } from "react-phone-number-input";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

interface Props {
  user: User;
  sellFlatIndex: number;
  sellFlowIndices: { outerIndex: number; innerIndex: number };
  stepPercentage: number[];
}

export default function Contact({ user, sellFlatIndex, sellFlowIndices, stepPercentage }: Props) {
  const { setSellFlowFlatIndex, setSellFlowIndices, setStepPercentage, setIsLoading, currentHome, setNewHome } =
    useContext(SellContext);

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
      isValidPhoneNumber(propertyOwnerPhone)
    ) {
      ({
        ...currentHome,
        contactName: propertyOwnerName,
        contactEmail: propertyOwnerEmail,
        contactPhone: propertyOwnerPhone,
      });
    }
  }, [propertyOwnerName, propertyOwnerEmail, propertyOwnerPhone]);

  useEffect(() => {
    setSellFlowIndices(sellFlowIndices);
    setSellFlowFlatIndex(sellFlatIndex);
    setStepPercentage(stepPercentage);
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center gap-y-20">
      <div className="flex flex-col mb-20 w-full h-full justify-start items-center text-center">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center py-3">
            <h1 className="flex items-center text-3xl">Contact</h1>
          </div>
          <div className="flex flex-col px-8 mt-5">
            <h3 className="text-lg w-full">Confirm details of the property owner</h3>
          </div>
        </div>
        <div className="flex h-full w-2/3 justify-center pt-12 gap-8">
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <h2 className="flex font-medium text-right w-1/12 justify-end">Name:</h2>
              <div className="flex w-full">
                <Input
                  value={propertyOwnerName}
                  onChange={(e) => setPropertyOwnerName(e.target.value)}
                  placeholder="Enter the property owner's name..."
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <h2 className="flex font-medium text-right w-1/12 justify-end">Email:</h2>
              <div className="flex w-full">
                <Input
                  value={propertyOwnerEmail}
                  onChange={(e) => setPropertyOwnerEmail(e.target.value)}
                  placeholder="Enter the property owner's email..."
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 w-full">
              <h2 className="flex font-medium text-right w-1/12 justify-end">Mobile:</h2>
              <div className="flex w-full">
                <CustomPhoneInput
                  value={propertyOwnerPhone}
                  onChange={setPropertyOwnerPhone}
                  placeholder="Enter the property owner's mobile number..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
