import { useContext, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { I18nProviderClient } from "@/locales/client";
import Contact from "@/app/[locale]/homes/[homeId]/edit/contact";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon, Phone, PhoneCall } from "lucide-react";
import { HomeContext } from "@/context/HomeContext";

export default function ContactDialog({
  contactTitle,
  contactNameText,
  contactEmailText,
  contactPhoneText,
  revealContact,
  copiedField,
  contactButton,
  isLargeScreen,
}: {
  contactTitle?: string;
  contactNameText?: string;
  contactEmailText?: string;
  contactPhoneText?: string;
  revealContact?: boolean;
  copiedField?: string | null;
  contactButton: string;
  isLargeScreen: boolean;
}) {
  const { home } = useContext(HomeContext);
  const { defaultLanguage } = useContext(LocaleContext);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
      <DialogTrigger asChild>
        <div className="w-full h-full hover:cursor-pointer border-2 border-primary animate-pulse rounded-lg bg-primary/10">
          {isLargeScreen ? (
            <Card className="w-full max-w-xs shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm md:text-base lg:text-lg">{contactTitle}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col items-start">
                  <span className="text-start text-xs md:text-sm">{contactNameText}</span>
                  <div
                    className={`${
                      !revealContact ? "blur-sm select-none" : "select-text"
                    } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                  >
                    <div className="text-start">{home.contactName}</div>
                    <Button variant="outline" size="icon" className="flex text-xs gap-2 p-2" disabled={!revealContact}>
                      {copiedField === "name" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-start text-xs md:text-sm">{contactEmailText}</span>
                  <div
                    className={`${
                      !revealContact ? "blur-sm select-none" : "select-text"
                    } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                  >
                    <div className="justify-start truncate">{home.contactEmail}</div>
                    <Button variant="outline" size="icon" className="flex text-xs gap-2 p-2" disabled={!revealContact}>
                      {copiedField === "email" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-start text-xs md:text-sm">{contactPhoneText}</span>
                  <div
                    className={`${
                      !revealContact ? "blur-sm select-none" : "select-text"
                    } flex items-center justify-between text-xs md:text-sm lg:text-base lg:text-start font-medium w-full gap-x-2`}
                  >
                    <div className="justify-start">{home.contactPhone}</div>
                    <Button variant="outline" className="flex text-xs gap-2 p-2" size="icon" disabled={!revealContact}>
                      {copiedField === "phone" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4">
                  <Button
                    variant="default"
                    className="flex justify-center max-w-md text-center h-full w-[300px]" // Adjust the width as needed
                  >
                    <div className="flex gap-3 justify-center text-lg items-center">
                      {revealContact ? <PhoneCall className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                      <span className="text-xs md:text-sm lg:text-base">{contactButton}</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button className={`flex w-full px-4 justify-center gap-2 text-center`} variant={"default"}>
              <div className="flex justify-center">{<Phone className="w-4 h-4" />}</div>
              <div className="text-xs xs:text-sm">{contactButton}</div>
            </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-6xl h-[80%]">
        <I18nProviderClient locale={defaultLanguage}>
          <Contact />
        </I18nProviderClient>
      </DialogContent>
    </Dialog>
  );
}
