"use client";

import { QueryContext } from "@/context/QueryContext";
import { LocaleContext } from "@/context/LocaleContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  CopyIcon,
  CheckIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import lookup from "country-code-lookup";
import { formatNumber } from "@/lib/utils";
import BrokenPrice from "@/components/BrokenPrice";
import {
  Languages,
  Phone,
  PhoneCall,
  BedDouble,
  CookingPot,
  Bath,
  Sofa,
  Pencil,
  Users,
  Ruler,
  Footprints,
  LandPlot,
  Save,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { handleCopy } from "@/lib/utils";
import { HomeContext } from "@/context/HomeContext";
import { typeIcons } from "../Icons/typeIcons";
import { useTheme } from "next-themes";
import { featureIcons } from "../Icons/featureIcons";
import BuyNowButton from "@/components/BuyNowButton";
import ReactQuill from "react-quill";
import "@/app/[locale]/quill.css"; // Import Quill styles
import TypeDialog from "./TypeDialog";
import DescriptionDialog from "./DescriptionDialog";
import PriceDialog from "./PriceDialog";
import ContactDialog from "./ContactDialog";
import CapacityDialog from "./CapacityDialog";
import RoomsDialog from "./RoomsDialog";
import FeaturesDialog from "./FeaturesDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PricingDialog from "@/components/PricingPageContent/Dialog";

interface Props {
  units: { m: string; ft: string };
  capacityText: { single: string; plural: string };
  capacityTitle: string;
  roomsTitle: string;
  featuresTitle: string;
  priceTitle: string;
  originalPrice: string;
  negotiable: string;
  contactThanks: string;
  buyNow: string;
  loginToPurchase: string;
  sizeTitle: string;
  showPrice: string;
  hidePrice: string;
  contactTitle: string;
  contactNameText: string;
  contactEmailText: string;
  contactPhoneText: string;
  contactButton: string;
  bedroomsText: { single: string; plural: string };
  bathroomsText: { single: string; plural: string };
  livingroomsText: { single: string; plural: string };
  kitchensText: { single: string; plural: string };
  translateButton: string;
  showOriginalButton: string;
  edit: string;
  save: string;
}

export default function HomeText({
  units,
  capacityText,
  capacityTitle,
  roomsTitle,
  featuresTitle,
  priceTitle,
  originalPrice,
  negotiable,
  contactThanks,
  buyNow,
  loginToPurchase,
  sizeTitle,
  showPrice,
  hidePrice,
  contactTitle,
  contactNameText,
  contactEmailText,
  contactPhoneText,
  contactButton,
  bedroomsText,
  bathroomsText,
  livingroomsText,
  kitchensText,
  translateButton,
  showOriginalButton,
  edit,
  save,
}: Props) {
  const { setCurrentHome, setQuery, openLogInModal, revealPrice, setRevealPrice, revealContact, isModalOpen } =
    useContext(QueryContext);
  const {
    home,
    matchingTypes,
    matchingFeatures,
    currentType,
    setCurrentType,
    translatedMunicipality,
    translationLoading,
    descriptionLoading,
    description,
    handleDescriptionConvert,
    originalDescription,
    countryName,
    editMode,
    setEditMode,
    homeOwnerName,
    homeOwnerEmail,
    homeOwnerPhone,
    handleGetContactInfo,
    fetchingContactInfo,
    billingError,
    contactInfoError,
    redirectUrl,
  } = useContext(HomeContext);

  const { defaultCurrency, currencyData, numerals, sessionLoading, sessionUnauthenticated, user } =
    useContext(LocaleContext);
  const [feet, setFeet] = useState(false);
  const [sqSize, setSqSize] = useState(home.areaSqm);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [openBillingModal, setOpenBillingModal] = useState<boolean>(false);

  const quillRef = useRef<ReactQuill | null>(null);
  const [quillDimensions, setQuillDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // If the Quill editor is loaded, capture its width and height
    if (quillRef.current && !translationLoading && !descriptionLoading) {
      const quillInstance = quillRef.current.getEditor(); // Get the Quill instance
      const quillElement = quillInstance.root; // Access the root element
      setQuillDimensions({
        width: quillElement.offsetWidth,
        height: quillElement.offsetHeight,
      });
    }
  }, [translationLoading, descriptionLoading]);

  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    const ftConversion = 10.76391042;
    setSqSize(!feet ? home.areaSqm : Math.round(home.areaSqm * ftConversion));
  }, [feet]);

  useEffect(() => {
    if (home && home.address) {
      setCurrentHome(home);
      setQuery(home.address);
    }
  }, [home]);

  const IconComponent = typeIcons[currentType.id as keyof typeof typeIcons]; // Get the corresponding icon

  const originalCurrencyRate = currencyData?.prices.find((c) => home.currency === c.symbol)?.usdPrice ?? null;

  return (
    <div className="flex flex-col w-full h-full justify-center px-6 py-3">
      <div className="flex flex-row w-full h-full justify-between gap-8">
        <div className="flex flex-col justify-start text-start w-full sm:w-2/3 gap-6 h-auto">
          {translationLoading ? (
            <div className="flex justify-center sm:justify-start w-full">
              <Skeleton className="h-[6vh] sm:h-[6vh] md:h-[6.5vh] lg:h-[6.5vh] w-11/12" />
            </div>
          ) : (
            <div className="flex flex-col items-center sm:items-start gap-5">
              {user &&
                user.id === home.ownerId &&
                (editMode ? (
                  <Button
                    disabled={editLoading}
                    className="flex sm:hidden justify-center w-full gap-3"
                    size={"lg"}
                    onClick={() => {
                      setEditMode(!editMode);
                    }}
                  >
                    <Save size={18} />
                    {save}
                  </Button>
                ) : (
                  <Button
                    disabled={editLoading}
                    className="flex sm:hidden justify-center w-full gap-3"
                    size={"lg"}
                    onClick={() => {
                      setEditMode(true);
                    }}
                  >
                    <Pencil size={18} />
                    {edit}
                  </Button>
                ))}

              {IconComponent &&
                (editMode ? (
                  <TypeDialog />
                ) : (
                  <div className="relative flex items-center justify-center h-12 w-full">
                    <Button
                      className="flex sm:absolute -left-3 items-center justify-center h-12 gap-2 pl-2 pr-2 disabled:opacity-70"
                      variant={"ghost"}
                      disabled={matchingTypes.length > 1 ? false : true}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const newIndex = (index + 1) % matchingTypes.length;
                        setIndex(newIndex);
                        setCurrentType(matchingTypes[newIndex]);
                      }}
                    >
                      <div className="flex">
                        <IconComponent color={theme === "dark" ? "white" : "black"} width={42} height={42} />
                      </div>
                      <h3 className="flex w-full text-3xl font-normal">{currentType.translation}</h3>
                    </Button>
                  </div>
                ))}
              <div className="flex flex-col sm:flex-row text-center sm:text-start gap-2 flex-wrap justify-center sm:justify-start text-2xl lg:text-2xl">
                <div>{translatedMunicipality ? translatedMunicipality : home.municipality}</div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:flex text-gray-300"> |</span>
                  {countryName}
                  {home.country && (
                    <FlagComponent
                      country={lookup.byIso(home.country)?.iso2 as Country}
                      countryName={home.country}
                      height={"h-6"}
                      width={"w-9"}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          <Separator />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className={`flex w-full h-full justify-start`}>
                <Button
                  disabled={descriptionLoading || translationLoading}
                  className="gap-2"
                  variant={"outline"}
                  onClick={handleDescriptionConvert}
                >
                  <Languages width={18} />
                  {originalDescription ? translateButton : showOriginalButton}
                </Button>
              </div>
              {editMode ? (
                <DescriptionDialog />
              ) : (
                <div className="text-base">
                  {translationLoading || descriptionLoading ? (
                    <Skeleton
                      className="w-full"
                      style={{ width: `${quillDimensions.width}px`, height: `${quillDimensions.height}px` }}
                    />
                  ) : (
                    <ReactQuill
                      ref={quillRef}
                      theme={"snow"}
                      readOnly={true}
                      value={description!}
                      modules={{ toolbar: false }} // Disable the toolbar
                    />
                  )}
                </div>
              )}
            </div>

            {editMode ? (
              <CapacityDialog
                capacityTitle={capacityTitle}
                capacityText={capacityText}
                sizeTitle={sizeTitle}
                units={units}
                sqSize={sqSize}
                feet={feet}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {currentType.id !== "warehouse" && currentType.id !== "land" && (
                  <div className="flex flex-col gap-3">
                    <div className="text-lg sm:text-xl">{capacityTitle}</div>
                    <div className="flex items-center gap-3 pl-1">
                      <Users size={20} strokeWidth={1.5} />
                      <div className="flex items-center gap-1">
                        <span>{formatNumber(home.capacity, numerals)}</span>
                        {home.capacity === 0 ? capacityText.single : capacityText.plural}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center text-lg sm:text-xl">{sizeTitle}</div>
                  </div>
                  <div className="flex gap-3 items-center pl-1">
                    <div className="flex">
                      <LandPlot size={20} strokeWidth={1.25} />
                    </div>
                    <div className="flex flex-col">
                      {formatNumber(sqSize, numerals)} {feet ? units.ft : units.m}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      className="flex items-center gap-3"
                      variant={"secondary"}
                      size={"default"}
                      onClick={() => {
                        if (feet) {
                          setFeet(true);
                        } else {
                          setFeet(false);
                        }
                        setFeet(!feet);
                      }}
                    >
                      {feet ? <Ruler size={18} strokeWidth={1.25} /> : <Footprints size={18} strokeWidth={1.25} />}
                      {feet ? units.m : units.ft}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {editMode ? (
              <RoomsDialog
                roomsTitle={roomsTitle}
                bedroomsText={bedroomsText}
                bathroomsText={bathroomsText}
                livingroomsText={livingroomsText}
                kitchensText={kitchensText}
              />
            ) : (
              <div className="flex flex-col w-full sm:w-3/4">
                <div className="text-lg sm:text-xl mb-3">{roomsTitle}</div>
                <div className="flex flex-col w-full gap-3 pl-1">
                  <div className="flex gap-3 items-center">
                    <BedDouble size={18} strokeWidth={1.5} />
                    <span className="w-[1rem]">{formatNumber(home.bedrooms, numerals)}</span>{" "}
                    <span>{home.bedrooms !== 1 ? bedroomsText.plural : bedroomsText.single}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Bath size={18} strokeWidth={1.5} />
                    <span className="w-[1rem]">{formatNumber(home.bathrooms, numerals)}</span>
                    <span>{home.bathrooms !== 1 ? bathroomsText.plural : bathroomsText.single}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Sofa size={18} strokeWidth={1.5} />
                    <span className="w-[1rem]">{formatNumber(home.livingrooms, numerals)}</span>
                    <span>{home.livingrooms !== 1 ? livingroomsText.plural : livingroomsText.single}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <CookingPot size={18} strokeWidth={1.5} />
                    <span className="w-[1rem]">{formatNumber(home.kitchens, numerals)}</span>
                    <span>{home.kitchens !== 1 ? kitchensText.plural : kitchensText.single}</span>
                  </div>
                </div>
              </div>
            )}
            {editMode ? (
              <FeaturesDialog featuresTitle={featuresTitle} />
            ) : (
              <div className="flex flex-col h-full">
                <div className="text-lg sm:text-xl mb-3">{featuresTitle}</div>
                <div className="gap-3 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 text-sm sm:text-lg">
                  {matchingFeatures.map((feature, index) => {
                    const FeatureIcon = featureIcons[feature.id as keyof typeof featureIcons]; // Get the corresponding icon

                    return (
                      FeatureIcon && (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex">
                            <FeatureIcon color={theme === "dark" ? "#FFFFFF" : "#000000"} width={25} height={25} />
                          </div>
                          <div className="flex text-xs sm:text-sm">{feature.translation}</div>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hidden sm:flex flex-col w-1/3 max-w-xs h-full items-end rounded-xl gap-10">
          {user &&
            user.id === home.ownerId &&
            (editMode ? (
              <Button
                disabled={editLoading}
                className="flex justify-center w-full gap-3"
                size={"lg"}
                onClick={() => {
                  setEditMode(!editMode);
                }}
              >
                <Save size={18} />
                Save changes
              </Button>
            ) : (
              <Button
                disabled={editLoading}
                className="flex justify-center w-full gap-3"
                size={"lg"}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <Pencil size={18} />
                {edit}
              </Button>
            ))}
          {editMode ? (
            <PriceDialog
              priceTitle={priceTitle}
              originalPrice={originalPrice}
              originalCurrencyRate={originalCurrencyRate}
              buyNow={buyNow}
              loginToPurchase={loginToPurchase}
              contactThanks={contactThanks}
              negotiable={negotiable}
              revealPrice={revealPrice}
              isModalOpen={isModalOpen}
              hidePrice={hidePrice}
              showPrice={showPrice}
              isLargeScreen={true}
            />
          ) : (
            <Card className="w-full max-w-xs shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm md:text-base lg:text-lg">{priceTitle}</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                {sessionLoading ? (
                  <div className="flex justify-center w-full">
                    <Skeleton className="h-8 md:h-9 lg:h-10 w-8/12" />
                  </div>
                ) : (
                  <BrokenPrice
                    priceUsd={home.priceUsd}
                    currency={defaultCurrency}
                    reveal={user ? true : false}
                    originalPrice={home.price}
                    originalCurrencySymbol={home.currency!}
                    blurAmount={"blur-lg"}
                    className="text-primary justify-center text-2xl md:text-3xl lg:text-4xl"
                  />
                )}
                <div className={`flex flex-col w-full`}>
                  <span className={`text-sm md:text-base lg:text-lg`}>
                    {originalPrice} ({home.currency})
                  </span>
                  {sessionLoading ? (
                    <div className="flex justify-center w-full">
                      <Skeleton className="items-center h-6 md:h-7 lg:h-7.5 w-7/12" />
                    </div>
                  ) : originalCurrencyRate && home.currency ? (
                    <BrokenPrice
                      priceUsd={home.priceUsd}
                      currency={{ symbol: home.currency, usdPrice: originalCurrencyRate }}
                      reveal={user ? true : false}
                      originalPrice={home.price}
                      originalCurrencySymbol={home.currency}
                      blurAmount={"blur-md"}
                      className="text-primary justify-center text-base md:text-lg lg:text-xl"
                    />
                  ) : (
                    "Contact us"
                  )}
                </div>
                <div className="flex flex-col items-center w-full gap-3">
                  <div className="flex items-center justify-center gap-2 w-full">
                    <span className="flex text-start font-medium text-xs md:text-sm lg:text-xl">{negotiable}</span>
                    <span className="flex text-center w-auto h-auto">
                      {home.priceNegotiable ? (
                        <span className="flex w-auto h-auto">
                          <CheckCircledIcon className="rounded-full text-primary w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                        </span>
                      ) : (
                        <span className="flex w-auto h-auto">
                          <CrossCircledIcon className="text-red-500 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                        </span>
                      )}
                    </span>
                  </div>

                  {sessionLoading ? (
                    <Skeleton className="h-[3.2vh] md:h-[3.2vh] lg:h-[2.8vh] xl:h-[2.8vh] w-11/12" />
                  ) : (
                    user &&
                    user.id && (
                      <BuyNowButton
                        homeId={home.id}
                        user={user}
                        buyNow={buyNow}
                        loginToPurchase={loginToPurchase}
                        contactThanks={contactThanks}
                      />
                    )
                  )}
                </div>
                {sessionLoading ||
                  (sessionUnauthenticated && (
                    <div className="flex items-center justify-center mt-4">
                      <Button
                        onClick={() => {
                          user ? setRevealPrice(!revealPrice) : openLogInModal();
                        }}
                        variant={"default"}
                        className="flex justify-center max-w-md text-center h-full w-[300px]" // Adjust the width as needed
                      >
                        <div className="flex gap-3 justify-center text-lg items-center">
                          {revealPrice || isModalOpen ? (
                            <EyeOpenIcon className="w-5 h-5" />
                          ) : (
                            <EyeClosedIcon className="w-5 h-5" />
                          )}
                          <span className="text-xs md:text-sm lg:text-base">{`${
                            revealPrice ? hidePrice : showPrice
                          }`}</span>
                        </div>
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
          {editMode ? (
            <ContactDialog
              contactTitle={contactTitle}
              contactNameText={contactNameText}
              contactEmailText={contactEmailText}
              contactPhoneText={contactPhoneText}
              revealContact={revealContact}
              copiedField={copiedField}
              contactButton={contactButton}
              isLargeScreen={true}
            />
          ) : (
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
                    <div className="text-start">{homeOwnerName}</div>
                    <Button
                      onClick={() => homeOwnerName && handleCopy(homeOwnerName, "name", setCopiedField)}
                      variant="outline"
                      size="icon"
                      className="flex text-xs gap-2 p-2"
                      disabled={!revealContact}
                    >
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
                    <div className="justify-start truncate">{homeOwnerEmail}</div>
                    <Button
                      onClick={() => homeOwnerEmail && handleCopy(homeOwnerEmail, "email", setCopiedField)}
                      variant="outline"
                      size="icon"
                      className="flex text-xs gap-2 p-2"
                      disabled={!revealContact}
                    >
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
                    <div className="justify-start">{homeOwnerPhone}</div>
                    <Button
                      onClick={() => homeOwnerPhone && handleCopy(homeOwnerPhone, "phone", setCopiedField)}
                      variant="outline"
                      className="flex text-xs gap-2 p-2"
                      size="icon"
                      disabled={!revealContact}
                    >
                      {copiedField === "phone" ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4">
                  <Button
                    onClick={() => {
                      !billingError ? (user ? handleGetContactInfo() : openLogInModal()) : setOpenBillingModal(true);
                    }}
                    variant="default"
                    className="flex justify-center max-w-md text-center h-full w-[300px]" // Adjust the width as needed
                  >
                    <div className="flex gap-3 justify-center text-lg items-center">
                      {fetchingContactInfo ? (
                        <ReloadIcon className="w-5 h-5 animate-spin" />
                      ) : revealContact || isModalOpen ? (
                        <PhoneCall className="w-5 h-5" />
                      ) : (
                        <Phone className="w-5 h-5" />
                      )}
                      <span className="text-xs md:text-sm lg:text-base">
                        {contactInfoError
                          ? billingError
                            ? "Subscribe to reveal!"
                            : "An unknown error occured!"
                          : contactButton}
                      </span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Dialog open={openBillingModal} onOpenChange={setOpenBillingModal}>
            <DialogContent className="flex flex-col py-1 px-0 w-[90%] max-w-8xl h-[90%] overflow-y-auto">
              {user && <PricingDialog redirectUrl={redirectUrl} isCheckout={false} />}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
