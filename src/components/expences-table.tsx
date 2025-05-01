"use client";

import { ExpenseItem } from "@/interfaces/store";

import { FC, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteExpense } from "@/app/actions/expences/expences";

interface ExpensesComponentProps {
  expenses: ExpenseItem[];
  setRevalidateKey?: React.Dispatch<React.SetStateAction<number>>;
}

export const ExpencesTable: FC<ExpensesComponentProps> = ({ expenses, setRevalidateKey }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns: ColumnDef<ExpenseItem>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return format(date, "dd/MM/yyyy", { locale: es });
      },
    },
    {
      accessorKey: "concept",
      header: "Concepto",
    },
    {
      accessorKey: "category",
      header: "Categoría",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <Badge variant={category === "operativo" ? "outline" : "secondary"}>
            {category === "operativo" ? "Operativo" : "Financiero"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));
        return `$${amount.toFixed(2)}`;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const expense = row.original;

        return (
          <Button
            variant="ghost"
            size="icon"
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              const { success } = await deleteExpense(expense.id);

              if (!success) {
                toast.error("Error al eliminar el gasto", {
                  description: "No se pudo eliminar el gasto.",
                  position: "top-right",
                });
                setIsSubmitting(false);
                return;
              }

              toast.success("Gasto eliminado", {
                description: "El gasto ha sido eliminado correctamente.",
                position: "top-right",
              });
              
              if (setRevalidateKey) setRevalidateKey((prev) => prev + 1);

              setIsSubmitting(false);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];
  return (
      <DataTable
        columns={columns}
        data={expenses}
        searchKey="concept"
        searchPlaceholder="Buscar por concepto..."
      />
  );
};
