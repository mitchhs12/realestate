"use client";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
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

interface Props {
  openSignUpModal: () => void;
  openLogInModal: () => void;
}

export function ProfileButton({ openSignUpModal, openLogInModal }: Props) {
  const session = useSession();
  const user = session.data?.user;

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <HamburgerMenuIcon className="mr-3 ml-1 h-4 w-4" />
          {user && user.name && user.image ? (
            <Avatar className="ml-1 h-8 w-8">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          ) : session.status !== "loading" ? (
            <PersonIcon className="ml-2 h-7 w-7" />
          ) : (
            <Skeleton className="ml-1 h-8 w-8 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2" side="bottom" align="end">
        {user && user.name ? (
          <DropdownMenuLabel>{user.name.split(" ")[0]}&apos;s Profile</DropdownMenuLabel>
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
              LogOut
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
