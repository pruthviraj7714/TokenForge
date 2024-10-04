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
