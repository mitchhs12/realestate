import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const params = await request.json();

  const homeId: number = params.homeId;

  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return NextResponse.json({ error: "User not found", accountValid: false }, { status: 500 });
  }

  const { id: userId, sellerSubscription, buyerSubscription } = user;

  const existingTransaction = await prisma.contactCreditTransaction.findUnique({
    where: {
      userId_homeId: {
        userId,
        homeId,
      },
    },
  });

  if (existingTransaction) {
    const homeContactDetails = await prisma.home.findUnique({
      where: { id: homeId },
      select: {
        contactName: true,
        contactEmail: true,
        contactPhone: true,
      },
    });
    return NextResponse.json({ result: homeContactDetails, accountValid: true }, { status: 200 });
  } else {
    if (user.contactCredits === 0) {
      return NextResponse.json({ error: "Insufficient credits", accountValid: false }, { status: 500 });
    }

    if (!sellerSubscription || !buyerSubscription) {
      return NextResponse.json({ error: "Not subscribed", accountValid: false }, { status: 500 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          contactCredits: { decrement: 1 },
        },
      }),
      prisma.contactCreditTransaction.create({
        data: {
          userId: userId,
          homeId: homeId,
        },
      }),
    ]);

    const homeContactDetails = await prisma.home.findUnique({
      where: { id: homeId },
      select: {
        contactName: true,
        contactEmail: true,
        contactPhone: true,
      },
    });

    return NextResponse.json({ result: homeContactDetails, accountValid: true }, { status: 200 });
  }
}
