// app/auth/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !credentials.email ||
          !credentials.password
        ) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password || user.isExtAuth) {
          throw new Error("Invalid credentials or external user.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isExtAuth: false,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              isExtAuth: true,
            },
          });
        }

        if (existingUser && !existingUser.isExtAuth) {
          throw new Error("Use email/password to login.");
        }
      }

      return true;
    },

    async jwt({ token, account, user }) {
      if (account?.provider === "google") {
        token.isExtAuth = true;
      } else if (user?.isExtAuth === false) {
        token.isExtAuth = false;
      }

      if (user?.id) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isExtAuth = token.isExtAuth as boolean;

        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            stripeCustomerId: true,
            subscription_status: true,
          },
        });

        session.user.stripeCustomerId = dbUser?.stripeCustomerId || null;
        session.user.subscription_status = dbUser?.subscription_status || null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
