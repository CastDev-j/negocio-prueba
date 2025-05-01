"use server";

import { auth } from "@/auth";
import { CostInput } from "@/interfaces/store";
import { getUserIdByEmail } from "../auth/getUserIByEmail";
import { PrismaClient } from "@/app/generated/prisma";
import { updatePaths } from "@/lib/helpers/updatePaths";
// import { prisma } from "@/prisma";

const prisma = new PrismaClient();

export const getAdminCosts = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { role } = user;

    if (role !== "admin") throw new Error("User not authenticated");

    const costs = await prisma.cost.findMany({
      orderBy: { date: "desc" },
    });

    return {
      success: true,
      message: "Costs fetched successfully",
      data: costs.map((cost) => {
        return {
          ...cost,
          date: cost.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching costs",
      error: (error as Error).message,
    };
  }
};

export const getCosts = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;

    if (!userId) throw new Error("User not authenticated");

    const costs = await prisma.cost.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return {
      success: true,
      message: "Costs fetched successfully",
      data: costs.map((cost) => {
        return {
          ...cost,
          date: cost.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching costs",
      error: (error as Error).message,
    };
  }
};

export const getCostsByUserId = async (userId: string) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { role } = user;

    if (role !== "admin") throw new Error("User not authenticated");
    
    const costs = await prisma.cost.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    if (!costs) throw new Error("No costs found");

    return {
      success: true,
      message: "Costs fetched successfully",
      data: costs.map((cost) => {
        return {
          ...cost,
          date: cost.date.toISOString().split("T")[0],
        };
      }),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching costs",
      error: (error as Error).message,
    };
  }
};

export const addCost = async (costData: CostInput) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;

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

    return {
      success: true,
      message: "Cost added successfully",
      data: costAdded,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error adding cost",
      error: (error as Error).message,
    };
  }
};

export const deleteCost = async (id: string) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const { user } = session;
    const { email } = user;

    const { success, data } = await getUserIdByEmail(email);

    if (!success) throw new Error("User not authenticated");

    const userId = data?.id;

    if (!userId) throw new Error("User not authenticated");

    const costDeleted = await prisma.cost.delete({
      where: { id, userId },
    });

    updatePaths();

    return {
      success: true,
      message: "Cost deleted successfully",
      data: costDeleted,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error deleting cost",
      error: (error as Error).message,
    };
  }
};
