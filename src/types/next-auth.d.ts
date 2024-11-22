import { DefaultSession } from "next-auth";
import { LanguageType } from "next-international";
import { Home, FavoriteList } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role: string | null;
    currency: string | null;
    buyerSubscription: string | null;
    sellerSubscription: string | null;
    language: LanguageType;
    phoneNumber: string | null;
    favoritedLists: (FavoriteList & { homes: HomeType[] })[];
    homes: HomeType[];
  }
}
