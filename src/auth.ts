import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Resend from "next-auth/providers/resend";
import Apple from "next-auth/providers/apple";
import type { Provider } from "next-auth/providers";

const providers: Provider[] = [
  Google,
  Apple,
  Facebook,
  Resend({
    from: "Alicia <alicia@vivaideal.com>",
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "/Logo.png",
    colorScheme: "auto",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  callbacks: {
    session({ session, user }) {
      // Return basic user information synchronously first
      session.user.role = user.role;
      session.user.phoneNumber = user.phoneNumber as string | null;
      session.user.currency = user.currency as string;
      session.user.language = user.language as string;

      // Now fetch relational data asynchronously (favoritedLists and homes)
      return session;
    },
  },
  providers,
});
