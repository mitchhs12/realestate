import { DefaultSession } from "next-auth";
import { LanguageType } from "next-international";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }

  interface User {
    role: string | null;
    currency: string;
    language: LanguageType;
    phoneNumber: string | null;
  }
}
