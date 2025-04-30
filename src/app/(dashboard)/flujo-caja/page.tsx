import { ExportDataButton } from "@/components/export-data-button";
import { FlowComponent } from "./ui/flow-component";
import { CostItem, ExpenseItem, IncomeItem } from "@/interfaces/store";
import { getIncome } from "@/app/actions/expences/incomes";
import { getCosts } from "@/app/actions/expences/costs";
import { getExpense } from "@/app/actions/expences/expences";
import { CashFlowData } from "@/interfaces/flow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinanzaPyme - Flujo de Caja",
  description: "Flujo de caja de tu negocio",
};

export default async function CashFlowPage() {
  const { data: incomeData = [], success: successIncome } = await getIncome();

  const incomes: IncomeItem[] = successIncome
    ? incomeData.map((income) => ({
        ...income,
        date: new Date(income.date),
      }))
    : [];

  const { data: costData = [], success: costSuccess } = await getCosts();

  const costs: CostItem[] = costSuccess
    ? costData.map((cost) => ({
        ...cost,
        date: new Date(cost.date),
      }))
    : [];

  const { data: expenceData = [], success: expenceSuccess } =
    await getExpense();

  const expenses: ExpenseItem[] = expenceSuccess
    ? expenceData.map((expense) => ({
        ...expense,
        date: new Date(expense.date),
      }))
    : [];

  const dateMap = new Map<
    string,
    { incomes: number; costs: number; expenses: number; date: Date }
  >();

  incomes.forEach((income) => {
    const dateStr = income.date.toISOString().split("T")[0];
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        incomes: 0,
        costs: 0,
        expenses: 0,
        date: new Date(dateStr),
      });
    }
    dateMap.get(dateStr)!.incomes += income.total;
  });

  costs.forEach((cost) => {
    const dateStr = cost.date.toISOString().split("T")[0];
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        incomes: 0,
        costs: 0,
        expenses: 0,
        date: new Date(dateStr),
      });
    }
    dateMap.get(dateStr)!.costs += cost.total;
  });

  expenses.forEach((expense) => {
    const dateStr = expense.date.toISOString().split("T")[0];
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        incomes: 0,
        costs: 0,
        expenses: 0,
        date: new Date(dateStr),
      });
    }
    dateMap.get(dateStr)!.expenses += expense.amount;
  });

  const sortedDates = Array.from(dateMap.entries()).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );

  let accumulatedBalance = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cashFlowData: CashFlowData[] = sortedDates.map(([_, amounts]) => {
    const dailyBalance = amounts.incomes - amounts.costs - amounts.expenses;
    accumulatedBalance += dailyBalance;

    return {
      date: amounts.date.toISOString(),
      incomes: amounts.incomes,
      costs: amounts.costs,
      expenses: amounts.expenses,
      dailyBalance,
      balance: accumulatedBalance,
    };
  });

  const displayData =
    cashFlowData.length > 0
      ? cashFlowData
      : [
          {
            date: new Date("2023-01-01").toISOString(),
            balance: 1000,
            incomes: 1000,
            costs: 0,
            expenses: 0,
            dailyBalance: 1000,
          },
          {
            date: new Date("2023-01-15").toISOString(),
            balance: 1500,
            incomes: 500,
            costs: 0,
            expenses: 0,
            dailyBalance: 500,
          },
        ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flujo de Caja</h1>
          <p className="text-muted-foreground mt-2">
            Visualización del saldo acumulado a lo largo del tiempo
          </p>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <ExportDataButton type="all" />
      </div>

      <FlowComponent cashFlowData={displayData} />
    </div>
  );
}
