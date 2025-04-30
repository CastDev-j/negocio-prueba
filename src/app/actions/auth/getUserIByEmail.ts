"use server";

import { prisma } from "@/prisma";

export const getUserIdByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // return user ? user.id : null;

    if (!user) {
      return { success: false, data: null, error: "User not found" };
    }

    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: (error as Error).message || "An error occurred",
    };
  }
};
