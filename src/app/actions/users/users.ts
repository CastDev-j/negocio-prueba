"use server";

const prisma = new PrismaClient();

import { $Enums, PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { updatePaths } from "@/lib/helpers/updatePaths";

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

export const changeUserRole = async (email: string, role: $Enums.Role) => {
  const session = await auth();

  if (!session) throw new Error("User not authenticated");

  const { user } = session;
  const { role: userRole } = user;

  if (userRole !== "admin") throw new Error("User not authenticated");

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role },
  });

  updatePaths();

  return updatedUser;
};

export const deleteUser = async (email: string) => {
  const session = await auth();

  if (!session) throw new Error("User not authenticated");

  const { user } = session;
  const { role: userRole } = user;

  if (userRole !== "admin") throw new Error("User not authenticated");

  console.log("Deleting user with email:", email);

  const deletedUser = await prisma.$transaction(async (tx) => {
    const userToDelete = await tx.user.findUnique({
      where: { email },
    });

    if (!userToDelete) throw new Error("User not found");

    // Delete related cost, expense, income (adjust table names as needed)
    await tx.cost.deleteMany({
      where: { userId: userToDelete.id },
    });

    await tx.expense.deleteMany({
      where: { userId: userToDelete.id },
    });

    await tx.income.deleteMany({
      where: { userId: userToDelete.id },
    });

    // Delete the user
    return await tx.user.delete({
      where: { email },
    });
  });

  updatePaths();

  return deletedUser;
};
