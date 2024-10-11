"use server";

import prisma from "@/lib/db";

export async function isUserVerified(walletAddress: string) {
  const user = await prisma.user.findFirst({
    where: {
      walletAddress,
    },
  });

  if (!user) {
    return false;
  }

  if (!user.isVerified) {
    return false;
  }

  return true;
}

export async function isTokenAlreadyExist(name: string, symbol: string) {
  const isExist = await prisma.token.findFirst({
    where: {
      OR: [{ name: name }, { symbol: symbol }],
    },
  });

  return isExist ? true : false;
}
