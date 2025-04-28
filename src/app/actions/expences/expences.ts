"use server";

import { auth } from "@/auth";
import { ExpenseInput, PrismaExpense } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
import { PrismaClient } from "@/app/generated/prisma";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

export const addExpense = async (
  expenseData: ExpenseInput
): Promise<PrismaExpense> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  return await prisma.expense.create({
    data: {
      ...expenseData,
      date: expenseData.date,
      userId,
      category: expenseData.category.toLowerCase() as "operativo" | "financiero",
    },
  });
};

export const deleteExpense = async (id: string): Promise<PrismaExpense> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  return await prisma.expense.delete({
    where: { id, userId },
  });
};