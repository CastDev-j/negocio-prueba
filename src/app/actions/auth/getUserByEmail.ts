"use server";

import { prisma } from "@/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        password: true,
      },
    });

    if (!user) {
      return { success: false, data: null, error: "User not found" };
    }

    return { success: true, data: user, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: (error as Error).message || "An error occurred",
    };
  }
};
