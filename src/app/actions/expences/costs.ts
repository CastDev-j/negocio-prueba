"use server";

import { auth } from "@/auth";
import { CostInput, PrismaCost } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
import { PrismaClient } from "@/app/generated/prisma";
import { updatePaths } from "@/lib/helpers/updatePaths";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

export const getAdminCosts = async () => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { role } = user;

  if (role !== "admin") throw new Error("User not authenticated");

  const costs = await prisma.cost.findMany({
    orderBy: { date: "desc" },
  });

  return costs.map((cost) => {
    return {
      ...cost,
      date: cost.date.toISOString().split("T")[0],
    };
  });
};

export const getCosts = async () => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  const costs = await prisma.cost.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return costs.map((cost) => {
    return {
      ...cost,
      date: cost.date.toISOString().split("T")[0],
    };
  });
};

export const addCost = async (costData: CostInput): Promise<PrismaCost> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  const total = costData.quantity * costData.price;

  const costAdded = await prisma.cost.create({
    data: {
      ...costData,
      date: costData.date,
      userId,
      total,
    },
  });

  updatePaths();

  return costAdded;
};

export const deleteCost = async (id: string): Promise<PrismaCost> => {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  const { user } = session;
  const { email } = user;

  const userId = await getUserIdByEmail(email);

  if (!userId) throw new Error("User not authenticated");

  const costDeleted = await prisma.cost.delete({
    where: { id, userId },
  });

  updatePaths();

  return costDeleted;
};
