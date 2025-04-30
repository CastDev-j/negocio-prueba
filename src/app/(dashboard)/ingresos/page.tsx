import { IncomeItem } from "@/interfaces/store";
import { IncomeComponent } from "./ui/income-component";
import { getIncome } from "@/app/actions/expences/incomes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinanzaPyme - Ingresos",
  description: "Controla tus ingresos y ventas",
};

export default async function IncomesPage() {
  const { data = [], success } = await getIncome();

  const incomes: IncomeItem[] = success
    ? data.map((income) => ({
        ...income,
        date: new Date(income.date),
      }))
    : [];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ingresos</h1>
        <p className="text-muted-foreground mt-2">
          Registra y administra los ingresos de tu negocio
        </p>
      </div>

      <IncomeComponent incomes={incomes} />
    </div>
  );
}
