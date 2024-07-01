"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import { useTheme } from "next-themes";

interface Props {
  user: any;
}

export function ProfileButton({ user }: Props) {
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
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          ) : (
            <PersonIcon className="ml-1 h-7 w-7" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2" side="bottom" align="end">
        {user ? (
          <DropdownMenuGroup>
            <DropdownMenuItem>{user.name.split(" ")[0]}&apos;s Profile</DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup className="cursor-pointer gap-y-2">
            <DropdownMenuItem className="cursor-pointer font-semibold" onClick={() => signIn()}>
              Log in
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => signIn()}>
              Sign up
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
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
        {user ? (
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Button onClick={() => signOut()}>Log out</Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
