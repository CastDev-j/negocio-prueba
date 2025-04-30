"use server";

import bcrypt from "bcryptjs";
import { RegisterFormValues } from "@/lib/schemas/finance-schemas";
import { prisma } from "@/prisma";

export const saveCredentialUser = async (data: RegisterFormValues) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, data: null, error: "EmailAlreadyExists" };
    }

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        role: "user",
      },
    });

    if (!newUser) {
      return { success: false, data: null, error: "default" };
    }

    return { success: true, data: newUser, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: (error as Error).message || "UnexpectedError",
    };
  }
};
