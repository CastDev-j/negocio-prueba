'use server';

import { prisma } from "@/prisma";

export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user ? user.id : null;
}