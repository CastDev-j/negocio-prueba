import { Cost, Expense, Income } from "@/app/generated/prisma";

export type IncomeItem = {
  id: string;
  date: Date;
  concept: string;
  quantity: number;
  price: number;
  total: number;
};

export type CostItem = {
  id: string;
  date: Date;
  concept: string;
  quantity: number;
  price: number;
  total: number;
};

export type ExpenseItem = {
  id: string;
  date: Date;
  concept: string;
  category: "operativo" | "financiero";
  amount: number;
};

// Tipos para los inputs de las acciones (sin id ni total calculado)
export type IncomeInput = Omit<IncomeItem, "id" | "total">;
export type CostInput = Omit<CostItem, "id" | "total">;
export type ExpenseInput = Omit<ExpenseItem, "id">;

// Tipos para las respuestas de Prisma
export type PrismaIncome = Income;
export type PrismaCost = Cost;
export type PrismaExpense = Expense;