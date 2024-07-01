import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "/tuna.svg",
    colorScheme: "auto",
  },
  adapter: PrismaAdapter(prisma),
  providers: [Google, Facebook],
});
