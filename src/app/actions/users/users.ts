"use server";

const prisma = new PrismaClient();

import { $Enums, PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { updatePaths } from "@/lib/helpers/updatePaths";

export const getUsers = async () => {
  try {
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

    if (!users) throw new Error("No users found");

    return {
      success: true,
      message: "Users fetched successfully",
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching users",
      error: (error as Error).message,
    };
  }
};

export const changeUserRole = async (email: string, role: $Enums.Role) => {
  try {
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

    if (!updatedUser) throw new Error("User not found");

    return {
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error changing user role",
      error: (error as Error).message,
    };
  }
};

export const deleteUser = async (email: string) => {
  try {
    const session = await auth();

    if (!session) throw new Error("User not authenticated");

    const { user } = session;
    const { role: userRole } = user;

    if (userRole !== "admin") throw new Error("User not authenticated");

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

    if (!deletedUser) throw new Error("User not found");

    return {
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error deleting user",
      error: (error as Error).message,
    };
  }
};
