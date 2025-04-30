"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { IncomeInput, PrismaIncome } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
import { updatePaths } from "@/lib/helpers/updatePaths";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

export const getAdminIncomes = async () => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");

  const { user } = session;
  const { role } = user;

  if (role !== "admin") throw new Error("User not authenticated");

  const incomes = await prisma.income.findMany({
    orderBy: { date: "desc" },
  });

  return incomes.map((income) => {
    return {
      ...income,
      date: income.date.toISOString().split("T")[0],
    };
  });
};

export const getIncome = async () => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  const incomes = await prisma.income.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return incomes.map((income) => {
    return {
      ...income,
      date: income.date.toISOString().split("T")[0],
    };
  });
};

export const addIncome = async (
  incomeData: IncomeInput
): Promise<PrismaIncome> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

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

  return incomeCreated;
};

export const deleteIncome = async (id: string): Promise<PrismaIncome> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);
  if (!userId) throw new Error("User not authenticated");

  const incomeDeleted = await prisma.income.delete({
    where: { id, userId },
  });

  updatePaths();

  return incomeDeleted;
};
