"use server";

import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";
import { RegisterFormValues } from "@/lib/schemas/finance-schemas";
import { redirect } from "next/navigation";

export const saveCredentialUser = async (data: RegisterFormValues) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return redirect("/register?error=EmailAlreadyExists");
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
    return redirect("/register?error=default");
  }

  return newUser;
};
