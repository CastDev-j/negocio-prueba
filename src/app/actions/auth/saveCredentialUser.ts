"use server";

import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";
import { RegisterFormValues } from "@/lib/schemas/finance-schemas";

export const saveCredentialUser = async (data: RegisterFormValues) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return null;
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
    return null;
  }

  return newUser;
};
