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
import { currencyOptions } from "@/lib/validations";
import { useContext } from "react";
import { CurrencyContext } from "@/context/CurrencyContext";

interface Props {
  openSignUpModal: () => void;
  openLogInModal: () => void;
  session: ReturnType<typeof useSession>;
}

export function ProfileButton({ openSignUpModal, openLogInModal, session }: Props) {
  const user = session.data?.user;
  const { defaultCurrency, setDefaultCurrency } = useContext(CurrencyContext);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Function to get initials from username
  const getInitials = (username: string) => {
    const parts = username.split(".");
    return parts
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  function getFlagEmoji(countryCode: string) {
    return countryCode.replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127365));
  }

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
          <DropdownMenuLabel>{user.name ? `Hi ${user.name.split(" ")[0]}!` : user.email}</DropdownMenuLabel>
        ) : (
          <DropdownMenuGroup className="cursor-pointer gap-y-2">
            <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => openLogInModal()}>
              Log in
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => openSignUpModal()}>
              Sign up
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
            <DropdownMenuSubTrigger>Currency</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-2 max-h-60 overflow-y-auto">
                <DropdownMenuRadioGroup value={defaultCurrency} onValueChange={setDefaultCurrency}>
                  {currencyOptions.map((config) => (
                    <DropdownMenuRadioItem key={config.currency} className="cursor-pointer" value={config.currency}>
                      {config.currency} {getFlagEmoji(config.locale.split("-")[1])}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="p-2">
                <DropdownMenuRadioGroup value={useTheme().theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem className="cursor-pointer" value="light">
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className="cursor-pointer" value="dark">
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className="cursor-pointer" value="system">
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>Support (coming soon)</DropdownMenuItem>
        {user && (
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push("/settings");
              }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
