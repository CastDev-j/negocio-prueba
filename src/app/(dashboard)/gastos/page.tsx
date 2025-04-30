import { getExpense } from "@/app/actions/expences/expences";
import { ExpensesComponent } from "./ui/expence-component";
import { ExpenseItem } from "@/interfaces/store";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinanzaPyme - Gastos",
  description: "Controla tus gastos operativos y financieros",
};


export default async function ExpensesPage() {
  const expenses: ExpenseItem[] =
    (await getExpense()).map((expense) => ({
      ...expense,
      date: new Date(expense.date),
    })) || [];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gastos</h1>
        <p className="text-muted-foreground mt-2">
          Registra y administra los gastos operativos y financieros de tu
          negocio
        </p>
      </div>

      <ExpensesComponent expenses={expenses} />
    </div>
  );
}
