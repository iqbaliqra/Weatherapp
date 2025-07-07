declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isExtAuth: boolean;
      stripeCustomerId: string;
      subscription_status: string;
    };
  }
}