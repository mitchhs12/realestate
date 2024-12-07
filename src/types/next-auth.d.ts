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
    customerId: string | null;
    buyerSubscription: string | null;
    sellerSubscription: string | null;
    buyerSubIsYearly: boolean;
    sellerSubIsYearly: boolean;
    buyerSubscriptionId: string | null;
    sellerSubscriptionId: string | null;
    contactCredits: number;
    sellCredits: number;
    language: LanguageType;
    phoneNumber: string | null;
    favoritedLists: (FavoriteList & { homes: HomeType[] })[];
    homes: HomeType[];
  }
}
