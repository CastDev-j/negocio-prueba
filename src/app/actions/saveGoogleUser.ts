"use server";

import { prisma } from "@/prisma";
import { User } from "../generated/prisma";
import bcrypt from "bcryptjs";

export const saveGoogleUser = async (user: User) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (existingUser) {
    return existingUser;
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
    return null;
  }

  return newUser;
};
