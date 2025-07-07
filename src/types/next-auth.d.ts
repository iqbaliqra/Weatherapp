import  { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isExtAuth?: boolean;
      stripeCustomerId?: string | null;
      subscription_status?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    isExtAuth?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isExtAuth?: boolean;
  }
}
