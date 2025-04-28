"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { IncomeInput, PrismaIncome } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

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
  const created = await prisma.income.create({
    data: {
      ...incomeData,
      userId,
      total,
    },
  });

  return created;
};

export const deleteIncome = async (id: string): Promise<PrismaIncome> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);
  if (!userId) throw new Error("User not authenticated");

  return await prisma.income.delete({
    where: { id, userId },
  });
};
