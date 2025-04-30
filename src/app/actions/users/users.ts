"use server";

const prisma = new PrismaClient();

import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";

export const getUsers = async () => {
  const session = await auth();

  if (!session) throw new Error("User not authenticated");

  const { user } = session;
  const { role } = user;

  if (role !== "admin") throw new Error("User not authenticated");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return users;
};
