"use client";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
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
import { CircleUser, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { languages, LanguageType, locales } from "@/lib/validations";
import { useContext } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { getFullLanguageName } from "@/lib/utils";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { getCurrency } from "@/lib/utils";
import { updateLanguage } from "@/app/[locale]/settings/actions";
import { FlagComponent } from "@/components/ui/phone-input";
import { Country } from "react-phone-number-input";
import { languageToFlagMap } from "@/lib/validations";
import { QueryContext } from "@/context/QueryContext";
import { Languages, CircleDollarSign, Settings, SunMoon, LogOut, Sun, Moon, Laptop, House, Heart } from "lucide-react";

interface Props {
  openSignUpModal: () => void;
  openLogInModal: () => void;
}

export function ProfileButton({ openSignUpModal, openLogInModal }: Props) {
  const { defaultCurrency, setDefaultCurrency, currencies } = useContext(LocaleContext);
  const { user, session, headerValues } = useContext(QueryContext);
  const router = useRouter();
  const { setTheme } = useTheme();
  const changeLang = useChangeLocale();
  const lang = useCurrentLocale();
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
  } = headerValues;

  const handleUpdateLanguage = async (newLang: LanguageType) => {
    await updateLanguage({ language: newLang });
    changeLang(newLang);
  };

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
      <DropdownMenuTrigger asChild>
        <Button className="h-12" variant="outline">
          <Menu width={20} height={20} strokeWidth={1.75} className="hidden sm:flex mr-2 ml-1" />
          {user && user.email ? (
            <Avatar className="h-6 w-6">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name ? user.name : user.email} />
              ) : (
                <AvatarFallback>{user.name ? getInitials(user.name) : user.email[0]}</AvatarFallback>
              )}
            </Avatar>
          ) : session.status !== "loading" ? (
            <CircleUser width={24} height={24} strokeWidth={1.5} />
          ) : (
            <Skeleton className="h-6 w-6 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2" side="bottom" align="end">
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
                  router.push("/my-lists");
                }}
              >
                <Heart width={20} height={20} strokeWidth={1.25} />
                {mylists}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : (
          <DropdownMenuGroup className="cursor-pointer gap-y-2">
            <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => openLogInModal()}>
              {log_in}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => openSignUpModal()}>
              {sign_up}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        {/* Admin Menu */}
        {user?.role === "admin" && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push("/admin");
              }}
            >
              Admin
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
                  value={lang}
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
                <DropdownMenuRadioGroup
                  value={defaultCurrency.symbol}
                  onValueChange={(symbol) => setDefaultCurrency(getCurrency(currencies, symbol))}
                >
                  {locales.map((config) => (
                    <DropdownMenuRadioItem
                      key={config.currency}
                      className="flex cursor-pointer justify-end gap-3 text-start"
                      value={config.currency}
                    >
                      {config.currency}
                      <FlagComponent
                        country={config.locale.split("-")[1].toUpperCase() as Country}
                        countryName={config.locale.split("-")[1].toUpperCase() as string}
                      />
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
