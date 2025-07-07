// app/api/activate-free-plan/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { subscription_status: "INACTIVE" },
  });

  return NextResponse.json({ message: "Free plan activated" });
}
