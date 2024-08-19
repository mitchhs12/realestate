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
import { PersonIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { languages, locales } from "@/lib/validations";
import { useContext } from "react";
import { LocaleContext } from "@/context/LocaleContext";
import { getFlagEmoji, getFullLanguageName } from "@/lib/utils";
import { useChangeLocale, useCurrentLocale, useScopedI18n } from "@/locales/client";
import { getCurrency } from "@/lib/utils";

interface Props {
  openSignUpModal: () => void;
  openLogInModal: () => void;
  session: ReturnType<typeof useSession>;
  greeting: string;
  log_in: string;
  sign_up: string;
  log_out: string;
  theme: { theme: string; light: string; dark: string; system: string };
  language: string;
  currency: string;
  settings: string;
}

export function ProfileButton({
  openSignUpModal,
  openLogInModal,
  session,
  greeting,
  log_in,
  sign_up,
  log_out,
  theme,
  language,
  currency,
  settings,
}: Props) {
  const user = session.data?.user;
  const { defaultCurrency, setDefaultCurrency, currencies } = useContext(LocaleContext);
  const router = useRouter();
  const { setTheme } = useTheme();
  const changeLang = useChangeLocale();
  const lang = useCurrentLocale();

  // Function to get initials from username
  const getInitials = (username: string) => {
    const parts = username.split(".");
    return parts
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <HamburgerMenuIcon className="hidden sm:flex mr-2 ml-1 h-4 w-4" />
          {user && user.email ? (
            <Avatar className="h-6 w-6">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name ? user.name : user.email} />
              ) : (
                <AvatarFallback>{user.name ? getInitials(user.name) : user.email[0]}</AvatarFallback>
              )}
            </Avatar>
          ) : session.status !== "loading" ? (
            <PersonIcon className="h-6 w-6" />
          ) : (
            <Skeleton className="h-6 w-6 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2" side="bottom" align="end">
        {user ? (
          <DropdownMenuLabel>{user.name ? `${greeting} ${user.name.split(" ")[0]}!` : user.email}</DropdownMenuLabel>
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
        <DropdownMenuSeparator />
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
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{theme.theme}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-2">
                <DropdownMenuRadioGroup value={useTheme().theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem className="cursor-pointer" value="light">
                    {theme.light}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className="cursor-pointer" value="dark">
                    {theme.dark}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className="cursor-pointer" value="system">
                    {theme.system}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{language}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-2 max-h-60 overflow-y-auto">
                <DropdownMenuRadioGroup
                  value={lang}
                  onValueChange={(newLanguage) => {
                    changeLang(newLanguage as any);
                  }}
                >
                  {languages.map((lang) => (
                    <DropdownMenuRadioItem key={lang} className="cursor-pointer" value={lang}>
                      {getFullLanguageName(lang)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{currency}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-2 max-h-60 overflow-y-auto">
                <DropdownMenuRadioGroup
                  value={defaultCurrency.symbol}
                  onValueChange={(symbol) => setDefaultCurrency(getCurrency(currencies, symbol))}
                >
                  {locales.map((config) => (
                    <DropdownMenuRadioItem key={config.currency} className="cursor-pointer" value={config.currency}>
                      {config.currency} {getFlagEmoji(config.locale.split("-")[1])}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {user && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push("/settings");
              }}
            >
              {settings}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>
              {log_out}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
