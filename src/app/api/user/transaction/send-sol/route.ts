import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { senderAddress, recipientAddress, amount, status } = await req.json();

  if (!recipientAddress || !amount || !senderAddress || !status) {
    return NextResponse.json(
      {
        message: "Recipient Address/ Amount/ status is missing",
      },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        walletAddress: senderAddress.toString(),
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

    await prisma.transaction.create({
      data: {
        status: status === "Success" ? "SUCCESS" : "FAILED",
        amount,
        userId: user.id,
        type: "SEND_SOL",
        recipientAddress,
      },
    });

    return NextResponse.json({
      message:
        status === "Success"
          ? "Successful Transaction!"
          : "Failed Transaction!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error!",
      },
      { status: 500 }
    );
  }
}
