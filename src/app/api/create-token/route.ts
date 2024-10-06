import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { metaData, walletAddress, status, transaction, supply } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        walletAddress,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found with this wallet address!",
        },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tranx) => {
      await tranx.token.create({
        data: {
          image: metaData.uri,
          name: metaData.name,
          supply: supply,
          symbol: metaData.symbol,
          txn: transaction,
          userId: user.id,
        },
      });

      await tranx.transaction.create({
        data: {
          status: status === "Success" ? "SUCCESS" : "FAILED",
          type: "CREATE_TOKEN",
          userId: user.id,
        },
      });
    });

    return NextResponse.json(
      {
        message:
          status === "Success"
            ? "Token Successfully Created"
            : "Failed to Create Token",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
