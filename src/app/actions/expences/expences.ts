"use server";

import { auth } from "@/auth";
import { ExpenseInput, PrismaExpense } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

export const getAdminExpenses = async () => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { role } = user;

  if (role !== "admin") throw new Error("User not authenticated");

  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" },
  });

  return expenses.map((expense) => {
    return {
      ...expense,
      date: expense.date.toISOString().split("T")[0],
    };
  });
};

export const getExpense = async () => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  const expences = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return expences.map((expence) => {
    return {
      ...expence,
      date: expence.date.toISOString().split("T")[0],
    };
  });
};

export const addExpense = async (
  expenseData: ExpenseInput
): Promise<PrismaExpense> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

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

  revalidatePath("/gastos");
  revalidatePath("/admin/gastos");

  return expenseAdded;
};

export const deleteExpense = async (id: string): Promise<PrismaExpense> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  const expenceDeleted = await prisma.expense.delete({
    where: { id, userId },
  });

  revalidatePath("/gastos");
  revalidatePath("/admin/gastos");

  return expenceDeleted;
};
