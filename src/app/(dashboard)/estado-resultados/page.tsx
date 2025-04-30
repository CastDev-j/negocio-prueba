import { ExportDataButton } from "@/components/export-data-button";
import { ResultStateComponent } from "./ui/results-state-component";
import { getIncome } from "@/app/actions/expences/incomes";
import { getCosts } from "@/app/actions/expences/costs";
import { getExpense } from "@/app/actions/expences/expences";
import { CostItem, ExpenseItem, IncomeItem } from "@/interfaces/store";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinanzaPyme - Estado de Resultados",
  description: "Estado de resultados de tu negocio",
};

export default async function ProfitLossPage() {
  const { data: incomeData = [], success: successIncome } = await getIncome();

  const incomes: IncomeItem[] = successIncome
    ? incomeData.map((income) => ({
        ...income,
        date: new Date(income.date),
      }))
    : [];

  const { data: costData = [], success: successData } = await getCosts();

  const costs: CostItem[] = successData
    ? costData.map((cost) => ({
        ...cost,
        date: new Date(cost.date),
      }))
    : [];

  const { data: expenseData = [], success: successExpense } =
    await getExpense();

  const expenses: ExpenseItem[] = successExpense
    ? expenseData.map((expense) => ({
        ...expense,
        date: new Date(expense.date),
      }))
    : [];

  const totalIncomes = incomes.reduce((total, income) => {
    return total + income.total;
  }, 0);

  const totalCosts = costs.reduce((total, cost) => {
    return total + cost.total;
  }, 0);

  const totalExpenses = expenses.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);

  const profit = totalIncomes - totalCosts - totalExpenses;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Estado de Resultados
          </h1>
          <p className="text-muted-foreground mt-2">
            Resumen de ingresos, costos, gastos y ganancias
          </p>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <ExportDataButton type="all" />
      </div>

      <ResultStateComponent
        profit={profit}
        totalCosts={totalCosts}
        totalExpenses={totalExpenses}
        totalIncomes={totalIncomes}
      />
    </div>
  );
}
