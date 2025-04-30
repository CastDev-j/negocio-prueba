"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCosts } from "@/app/actions/expences/costs";
import { getExpense } from "@/app/actions/expences/expences";
import { getIncome } from "@/app/actions/expences/incomes";

type ExportType = "incomes" | "costs" | "expenses" | "all";

export function ExportDataButton({ type = "all" }: { type?: ExportType }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async () => {
    setIsExporting(true);

    try {
      let data: {
        type: string;
        date: string;
        concept: string;
        quantity: number;
        price: number;
        total: number;
      }[] = [];
      let filename = "";
      let headers = "";

      if (type === "incomes" || type === "all") {
        const incomeData = ((await getIncome()) || []).map((income) => ({
          ...income,
          date: new Date(income.date).toLocaleDateString(),
          type: "Ingreso",
        }));
        data = [...data, ...incomeData];
        filename =
          type === "incomes" ? "ingresos.csv" : "datos_financieros.csv";
        headers = "Tipo,Fecha,Concepto,Cantidad,Precio,Total\n";
      }

      if (type === "costs" || type === "all") {
        const { data: costData, success: successCost } = await getCosts();

        const costs = successCost ? costData : [];

        const costDataFormatted = costs.map((cost) => ({
          ...cost,
          date: new Date(cost.date).toLocaleDateString(),
          type: "Costo",
        }));
        data = [...data, ...costDataFormatted];
        filename =
          type === "costs" ? "costos.csv" : filename || "datos_financieros.csv";
        headers = headers || "Tipo,Fecha,Concepto,Cantidad,Precio,Total\n";
      }

      if (type === "expenses" || type === "all") {
        const expenseData = ((await getExpense()) || []).map((expense) => ({
          ...expense,
          date: new Date(expense.date).toLocaleDateString(),
          type: "Gasto",
          quantity: 1,
          price: expense.amount,
          total: expense.amount,
        }));
        data = [...data, ...expenseData];
        filename =
          type === "expenses"
            ? "gastos.csv"
            : filename || "datos_financieros.csv";
        headers = headers || "Tipo,Fecha,Concepto,Cantidad,Precio,Total\n";
      }

      // Crear el contenido del CSV
      let csvContent = headers;

      data.forEach((item) => {
        const row = [
          item.type,
          item.date,
          item.concept,
          item.quantity,
          item.price,
          item.total,
        ].join(",");
        csvContent += row + "\n";
      });

      // Crear y descargar el archivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Datos exportados", {
        description: `Los datos han sido exportados a ${filename}`,
        position: "top-right",
      });
    } catch (error) {
      toast.error("Error al exportar", {
        description: "Ha ocurrido un error al exportar los datos.",
        position: "top-right",
      });
      console.error("Error al exportar datos:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await exportToCSV();
      }}
      disabled={isExporting}
    >
      <Download className="mr-2 h-4 w-4" />
      <span className="sm:flex hidden">Exportar a </span>
      <span>CSV</span>
    </Button>
  );
}
