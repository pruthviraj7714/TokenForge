import { NFT_IMAGES } from "@/constants/constant";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { publicKey } = await req.json();

    if (!publicKey) {
      return NextResponse.json(
        {
          message: "Public key is missing!",
        },
        { status: 400 }
      );
    }

    let user = await prisma.user.findFirst({
      where: {
        walletAddress: publicKey.toString(),
      },
      select: {
        isVerified: true,
        profilePhoto: true,
        walletAddress: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: publicKey.toString(),
          isVerified: false,
          profilePhoto:
            NFT_IMAGES[Math.floor(Math.random() * NFT_IMAGES.length)],
        },
      });
    }

    return NextResponse.json({
      user
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
