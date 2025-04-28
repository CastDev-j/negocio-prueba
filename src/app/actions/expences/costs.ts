"use server";

import { auth } from "@/auth";
import { CostInput, PrismaCost } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
import { PrismaClient } from "@/app/generated/prisma";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

export const addCost = async (costData: CostInput): Promise<PrismaCost> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  const total = costData.quantity * costData.price;

  return await prisma.cost.create({
    data: {
      ...costData,
      date: costData.date,
      userId,
      total,
    },
  });
};

export const deleteCost = async (id: string): Promise<PrismaCost> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  return await prisma.cost.delete({
    where: { id, userId },
  });
};
