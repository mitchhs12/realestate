"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { CircleUser, Menu, Sparkles, UserRoundPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { languages, LanguageType, locales } from "@/lib/validations";
import { useContext, useEffect, useState } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { getFullLanguageName } from "@/lib/utils";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { getCurrency } from "@/lib/utils";
import { updateLanguage } from "@/app/[locale]/settings/actions";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import { languageToFlagMap } from "@/lib/validations";
import { QueryContext } from "@/context/QueryContext";
import {
  Languages,
  CircleDollarSign,
  Settings,
  SunMoon,
  LogOut,
  Sun,
  Moon,
  Laptop,
  House,
  Heart,
  Lock,
  LogIn,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AIContent from "@/components/InteriorAI/Content";
import { I18nProviderClient } from "@/locales/client";
import PricingDialog from "@/components/PricingPageContent/Dialog";

interface Props {
  openSignUpModal: () => void;
  openLogInModal: () => void;
}

export default function ProfileButton({ openSignUpModal, openLogInModal }: Props) {
  const {
    defaultCurrency,
    defaultLanguage,
    setDefaultCurrency,
    currencyData,
    user,
    sessionLoading,
    sessionUnauthenticated,
  } = useContext(LocaleContext);
  const { headerValues } = useContext(QueryContext);
  const router = useRouter();
  const { setTheme } = useTheme();
  const changeLang = useChangeLocale();
  const [modalOpen, setModalOpen] = useState(false);
  const [openPricing, setOpenPricing] = useState(false);
  const {
    greeting,
    log_in,
    sign_up,
    log_out,
    theme_theme,
    theme_light,
    theme_dark,
    theme_system,
    language,
    currency,
    settings,
    myproperties,
    mylists,
    aiStudio,
    admin,
  } = headerValues;

  const pathname = usePathname();

  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${defaultLanguage}${pathname}`
      : `https://www.vivaideal.com/${defaultLanguage}${pathname}`;

  const handleUpdateLanguage = async (newLang: LanguageType) => {
    await updateLanguage({ language: newLang });
    changeLang(newLang);
  };

  useEffect(() => {
    if (openPricing) {
      setModalOpen(false);
    }
  }, [openPricing]);

  // Function to get initials from username
  const getInitials = (username: string) => {
    const parts = username.split(".");
    return parts
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={sessionLoading}>
        <Button className="h-12" variant="outline" disabled={sessionLoading}>
          <div className="flex items-center gap-2">
            {!user && <div className="hidden xs:flex">{log_in}</div>}
            {user && <Menu width={20} height={20} strokeWidth={1.75} className="hidden xs:inline" />}
            {sessionUnauthenticated ? (
              <CircleUser width={24} height={24} strokeWidth={1.5} />
            ) : sessionLoading ? (
              <Skeleton className="h-6 w-6 rounded-full" />
            ) : (
              user &&
              user.email && (
                <Avatar className="h-6 w-6">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name ? user.name : user.email} />
                  ) : (
                    <AvatarFallback>{user.name ? getInitials(user.name) : user.email[0]}</AvatarFallback>
                  )}
                </Avatar>
              )
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 p-2" side="bottom" align="end">
        {user ? (
          <>
            <DropdownMenuLabel>{user.name ? `${greeting} ${user.name.split(" ")[0]}!` : user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => {
                  router.push("/my-properties");
                }}
              >
                <House width={20} height={20} strokeWidth={1.25} />
                {myproperties}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => {
                  router.push("/my-wishlists");
                }}
              >
                <Heart width={20} height={20} strokeWidth={1.25} />
                {mylists}
              </DropdownMenuItem>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer flex w-full items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setModalOpen(true);
                    }}
                  >
                    <Sparkles width={20} height={20} strokeWidth={1.25} />
                    {aiStudio}
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent
                  className="flex flex-col justify-start items-center w-full h-full max-w-[90%] max-h-[85%] px-0 pb-4"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <I18nProviderClient locale={defaultLanguage}>
                    <AIContent setOpenPricing={setOpenPricing} />
                  </I18nProviderClient>
                </DialogContent>
              </Dialog>
              <Dialog open={openPricing} onOpenChange={setOpenPricing}>
                <DialogContent className="flex flex-col py-1 px-0 w-[90%] max-w-8xl h-[90%] overflow-y-auto">
                  <PricingDialog redirectUrl={redirectUrl} isCheckout={false} />
                </DialogContent>
              </Dialog>
            </DropdownMenuGroup>
          </>
        ) : (
          <DropdownMenuGroup className="cursor-pointer gap-y-2">
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2 font-semibold"
              onClick={() => openLogInModal()}
            >
              <LogIn width={20} height={20} strokeWidth={1.25} />
              {log_in}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2 font-semibold"
              onClick={() => openSignUpModal()}
            >
              <UserRoundPlus width={20} height={20} strokeWidth={1.25} />
              {sign_up}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        {/* Admin Menu */}
        {user?.role === "admin" && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                router.push("/admin");
              }}
            >
              <Lock width={20} height={20} strokeWidth={1.25} />
              {admin}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <Languages width={20} height={20} strokeWidth={1.25} />
              {language}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-2 max-h-60 overflow-y-auto">
                <DropdownMenuRadioGroup
                  value={defaultLanguage}
                  onValueChange={(newLanguage) => {
                    handleUpdateLanguage(newLanguage as LanguageType);
                  }}
                >
                  {languages.map((lang) => (
                    <DropdownMenuRadioItem
                      key={lang}
                      className="flex cursor-pointer justify-end gap-3 text-end"
                      value={lang}
                    >
                      {getFullLanguageName(lang)}
                      <FlagComponent country={languageToFlagMap[lang] as Country} countryName={lang as string} />
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <CircleDollarSign width={20} height={20} strokeWidth={1.25} />
              {currency}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-2 max-h-60 overflow-y-auto">
                {currencyData && (
                  <DropdownMenuRadioGroup
                    value={defaultCurrency?.symbol}
                    onValueChange={(symbol) => setDefaultCurrency(getCurrency(currencyData.prices, symbol))}
                  >
                    {locales.map((config) => (
                      <DropdownMenuRadioItem
                        key={config.currency}
                        className="flex cursor-pointer justify-end gap-3 text-start"
                        value={config.currency}
                      >
                        {config.currency}
                        <FlagComponent
                          country={config.locale.toUpperCase() as Country}
                          countryName={config.locale.toUpperCase() as string}
                        />
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <SunMoon width={20} height={20} strokeWidth={1.25} />
              {theme_theme}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-2">
                <DropdownMenuRadioGroup value={useTheme().theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem className="cursor-pointer justify-end flex gap-2 items-center" value="light">
                    {theme_light}
                    <Sun width={20} height={20} strokeWidth={1.25} />
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className="cursor-pointer justify-end flex gap-2 items-center" value="dark">
                    {theme_dark}
                    <Moon width={20} height={20} strokeWidth={1.25} />
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className="cursor-pointer justify-end flex gap-2 items-center" value="system">
                    {theme_system}
                    <Laptop width={20} height={20} strokeWidth={1.25} />
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {user && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                router.push("/settings");
              }}
            >
              <Settings width={20} height={20} strokeWidth={1.25} />
              {settings}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut width={20} height={20} strokeWidth={1.25} />
              {log_out}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
