import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        {
          message: "Wallet Address Missing!",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        walletAddress : walletAddress.toString(),
      },
      include: {
        transactions: {
          orderBy : {
            createdAt : "desc"
          },
          include : {
            token : true
          }
        },
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

    return NextResponse.json({
      transactions: user.transactions,
      profilePhoto : user.profilePhoto
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
