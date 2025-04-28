"use server";

import bcrypt from "bcryptjs";
import { RegisterFormValues } from "@/lib/schemas/finance-schemas";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";

export const saveCredentialUser = async (data: RegisterFormValues) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return redirect("/auth/register?error=EmailAlreadyExists");
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
    return redirect("/auth/register?error=default");
  }

  return newUser;
};
