import { ExportDataButton } from "@/components/export-data-button";
import { FlowComponent } from "./ui/flow-component";
import { CostItem, ExpenseItem, IncomeItem } from "@/interfaces/store";
import { getIncome } from "@/app/actions/expences/incomes";
import { getCosts } from "@/app/actions/expences/costs";
import { getExpense } from "@/app/actions/expences/expences";
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

      <FlowComponent costs={costs} incomes={incomes} expenses={expenses} />
    </div>
  );
}
