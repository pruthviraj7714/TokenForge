import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ed25519 } from "@noble/curves/ed25519";
import { PublicKey } from "@solana/web3.js";

export async function PATCH(req: NextRequest) {
  try {
    const { publicKey, message, signature } = await req.json();

    if (!publicKey || !message || !signature) {
      return NextResponse.json(
        {
          message: "Public Key/ Message/ Signature is missing!",
        },
        { status: 400 }
      );
    }

    const signatrueInU8int = new Uint8Array(signature);

    const isValid = ed25519.verify(
      signatrueInU8int,
      new TextEncoder().encode(message),
      new PublicKey(publicKey).toBytes()
    );

    if (!isValid) {
      return NextResponse.json(
        { message: "Signature verification failed" },
        { status: 400 }
      );
    }

    const updateResult = await prisma.user.updateMany({
      where: {
        walletAddress: publicKey.toString(),
      },
      data: {
        isVerified: true,
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        { message: "User not found or already verified" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User successfully verified!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
