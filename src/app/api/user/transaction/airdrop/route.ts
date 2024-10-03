import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    publicKey,
    amount,
    status,
  }: { publicKey: string; amount: number; status: "Success" | "Failed" } =
    await req.json();

  if (!publicKey || !amount) {
    return NextResponse.json(
      {
        message: "public key/ amount is missing!",
      },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        walletAddress: publicKey.toString(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found!",
        },
        { status: 404 }
      );
    }

    if (!user?.isVerified) {
      return NextResponse.json(
        {
          message: "Please Verify Your Wallet First!",
        },
        { status: 403 }
      );
    }

    await prisma.transaction.create({
      data: {
        type: "AIRDROP",
        status: status === "Success" ? "SUCCESS" : "FAILED",
        amount,
        userId: user?.id,
      },
    });

    return NextResponse.json(
      {
        message: status === "Success" ? "Success" : "Failed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error!",
      },
      { status: 500 }
    );
  }
}
