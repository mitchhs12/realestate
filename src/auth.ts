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
  Apple({
    clientId: process.env.AUTH_APPLE_ID,
    clientSecret: "" + process.env.AUTH_APPLE_SECRET,
    checks: ["pkce"],
    token: {
      url: `https://appleid.apple.com/auth/token`,
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    authorization: {
      params: {
        response_mode: "form_post",
        response_type: "code", //do not set to "code id_token" as it will not work
        scope: "name email",
      },
    },
    //@ts-ignore
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name || null, //profile.name.givenName + " " + profile.name.familyName, but apple does not return name...
        email: profile.email || null,
        image: null,
      };
    },
  }),
  Facebook,
  Resend({
    sendVerificationRequest({ identifier: email, url, provider: { from } }) {
      // Customize your email content
      const subject = `Welcome to Viva Ideal! Let's get going.`;
      const htmlContent = `
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <table align="center" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 20px; text-align: center; background-color: #16A34A; color: #ffffff;">
              <h1 style="margin: 0;">Welcome to Viva Ideal!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; color: #333333;">
              <p style="font-size: 18px;">Hi there,</p>
              <p style="font-size: 16px;">We're excited to have you! Click the button below to sign in and get started with Viva Ideal.</p>
              <p style="text-align: center;">
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #16A34A; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">Sign in</a>
              </p>
              <p style="font-size: 14px; color: #888888;">If you did not request this email, you can safely ignore it.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px; color: #aaaaaa; background-color: #f4f4f4;">
              <p>&copy; 2024 Viva Ideal, All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      `;

      // Send the email using Resend API
      return fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: email,
          subject,
          html: htmlContent,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Resend API error: ${res.statusText}`);
        }
      });
    },
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
      session.user.subscription = user.subscription as string | null;
      session.user.phoneNumber = user.phoneNumber as string | null;
      session.user.currency = user.currency as string;
      session.user.language = user.language as string;

      // Now fetch relational data asynchronously (favoritedLists and homes)
      return prisma.user
        .findUnique({
          where: { id: user.id },
          include: {
            favoritedLists: {
              include: {
                homes: true,
              },
            },
            homes: {
              where: {
                isDeleted: false,
              },
              include: {
                _count: {
                  select: {
                    favoritedLists: true, // Count how many favorite lists each home is in
                  },
                },
              },
            }, // Include homes owned by the user
          },
        })
        .then((dbUser) => {
          const homesWithFavoriteCount = dbUser?.homes.map((home) => ({
            ...home,
            favoritedCount: home._count.favoritedLists, // Add favorited count to each home
          }));
          // Attach favoritedLists and homes to the session after fetching them
          session.user.favoritedLists = dbUser?.favoritedLists || [];
          session.user.homes = homesWithFavoriteCount || [];
          return session; // Return the session with all the user data
        })
        .catch((error) => {
          console.error("Error fetching relational user data:", error);
          // Return session without relational data in case of an error
          session.user.favoritedLists = [];
          session.user.homes = [];
          return session;
        });
    },
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  providers,
});
