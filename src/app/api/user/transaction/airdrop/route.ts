import prisma from "@/lib/db";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { publicKey, amount }: { publicKey: string; amount: number } =
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

    const connection = new Connection(clusterApiUrl("devnet"));

    let transactionStatus = "SUCCESS";

    try {
      const signature = await connection.requestAirdrop(
        new PublicKey(publicKey),
        amount * LAMPORTS_PER_SOL
      );
      
      await connection.confirmTransaction(signature, "confirmed");
      
    } catch (error) {
      console.error("Airdrop error:", error);
      transactionStatus = "FAILED";
    }

    await prisma.transaction.create({
      data: {
        type: "AIRDROP",
        status: transactionStatus === "SUCCESS" ? "SUCCESS" : "FAILED" ,
        amount,
        userId: user?.id,
      },
    });

    return NextResponse.json(
      {
        message: transactionStatus === "SUCCESS" ? "Success" : "Failed",
      },
      { status: transactionStatus === "SUCCESS" ? 200 : 500 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error!",
      },
      { status: 500 }
    );
  }
}