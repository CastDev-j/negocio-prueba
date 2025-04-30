"use server";

import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";
import { GoogleUser } from "@/interfaces/user";

export const saveGoogleUser = async (user: GoogleUser) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return { success: true, data: existingUser, error: null };
    }

    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.password, 10),
        image: user.image,
        role: "user",
      },
    });

    if (!newUser) {
      return { success: false, data: null, error: "Failed to create user" };
    }

    return { success: true, data: newUser, error: null };
  } catch (error) {
    return { success: false, data: null, error: (error as Error).message };
  }
};
