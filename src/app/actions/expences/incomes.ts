"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { IncomeInput } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
import { updatePaths } from "@/lib/helpers/updatePaths";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

export const getAdminIncomes = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");

    const { user } = session;
    const { role } = user;

    if (role !== "admin") throw new Error("User not authenticated");

    const incomes = await prisma.income.findMany({
      orderBy: { date: "desc" },
    });

    if (!incomes) throw new Error("No incomes found");

    return {
      success: true,
      message: "Incomes fetched successfully",
      data: incomes.map((income) => {
        return {
          ...income,
          date: income.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching incomes",
      error: (error as Error).message,
    };
  }
};

export const getIncome = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;

    if (!userId) throw new Error("User not authenticated");

    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    if (!incomes) throw new Error("No incomes found");

    return {
      success: true,
      message: "Incomes fetched successfully",
      data: incomes.map((income) => {
        return {
          ...income,
          date: income.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching incomes",
      error: (error as Error).message,
    };
  }
};

export const getIncomesByUserId = async (userId: string) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { role } = user;

    if (role !== "admin") throw new Error("User not authenticated");

    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return {
      success: true,
      message: "Incomes fetched successfully",
      data: incomes.map((income) => {
        return {
          ...income,
          date: income.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching incomes",
      error: (error as Error).message,
    };
  }
};

export const addIncome = async (incomeData: IncomeInput) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;

    if (!userId) throw new Error("User not authenticated");

    const total = incomeData.quantity * incomeData.price;
    const incomeCreated = await prisma.income.create({
      data: {
        ...incomeData,
        userId,
        total,
      },
    });

    updatePaths();

    if (!incomeCreated) throw new Error("Error creating income");

    return {
      success: true,
      message: "Income created successfully",
      data: {
        ...incomeCreated,
        date: incomeCreated.date.toISOString().split("T")[0],
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error creating income",
      error: (error as Error).message,
    };
  }
};

export const deleteIncome = async (id: string) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;
    if (!userId) throw new Error("User not authenticated");

    const incomeDeleted = await prisma.income.delete({
      where: user.role === "admin" ? { id } : { id, userId },
    });

    updatePaths();

    if (!incomeDeleted) throw new Error("Error deleting income");

    return {
      success: true,
      message: "Income deleted successfully",
      data: incomeDeleted,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error deleting income",
      error: (error as Error).message,
    };
  }
};
