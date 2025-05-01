"use server";

import { auth } from "@/auth";
import { ExpenseInput } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
import { PrismaClient } from "@/app/generated/prisma";
import { updatePaths } from "@/lib/helpers/updatePaths";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

export const getAdminExpenses = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { role } = user;

    if (role !== "admin") throw new Error("User not authenticated");

    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
    });

    if (!expenses) throw new Error("No expenses found");

    return {
      success: true,
      message: "Expenses fetched successfully",
      data: expenses.map((expense) => {
        return {
          ...expense,
          date: expense.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching expenses",
      error: (error as Error).message,
    };
  }
};

export const getExpense = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;

    if (!userId) throw new Error("User not authenticated");

    const expences = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    if (!expences) throw new Error("No expenses found");

    return {
      success: true,
      message: "Expenses fetched successfully",
      data: expences.map((expense) => {
        return {
          ...expense,
          date: expense.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching expenses",
      error: (error as Error).message,
    };
  }
};

export const getExpensesByUserId = async (userId: string) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { role } = user;

    if (role !== "admin") throw new Error("User not authenticated");

    const expences = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return {
      success: true,
      message: "Expenses fetched successfully",
      data: expences.map((expense) => {
        return {
          ...expense,
          date: expense.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching expenses",
      error: (error as Error).message,
    };
  }
};

export const addExpense = async (expenseData: ExpenseInput) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;

    if (!userId) throw new Error("User not authenticated");

    const expenseAdded = await prisma.expense.create({
      data: {
        ...expenseData,
        date: expenseData.date,
        userId,
        category: expenseData.category.toLowerCase() as
          | "operativo"
          | "financiero",
      },
    });

    updatePaths();

    if (!expenseAdded) throw new Error("Expense not found");

    return {
      success: true,
      message: "Expense added successfully",
      data: expenseAdded,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error adding expense",
      error: (error as Error).message,
    };
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;

    if (!userId) throw new Error("User not authenticated");

    const expenceDeleted = await prisma.expense.delete({
      where: { id, userId },
    });

    updatePaths();

    if (!expenceDeleted) throw new Error("Expense not found");

    return {
      success: true,
      message: "Expense deleted successfully",
      data: expenceDeleted,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error deleting expense",
      error: (error as Error).message,
    };
  }
};
