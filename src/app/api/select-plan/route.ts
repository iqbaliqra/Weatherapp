import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { plan } = await req.json();

  if (plan !== "FREE") {
    return new Response("Invalid plan", { status: 400 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { subscription_status: "FREE" },
  });

  return new Response("OK");
}
