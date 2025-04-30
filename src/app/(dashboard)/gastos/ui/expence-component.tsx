"use client";

import { FC, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { ExpenseForm } from "@/components/expense-form";
import { ExportDataButton } from "@/components/export-data-button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteExpense } from "@/app/actions/expences/expences";
import { ExpenseItem } from "@/interfaces/store";

interface ExpensesComponentProps {
  expenses: ExpenseItem[];
}

export const ExpensesComponent: FC<ExpensesComponentProps> = ({ expenses }) => {
  const [activeTab, setActiveTab] = useState("registro");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => {
      return total + expense.amount;
    }, 0);
  };

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
              const {success} = await deleteExpense(expense.id);

              if (!success) {
                toast.error("Error al eliminar el gasto", {
                  description: "No se pudo eliminar el gasto.",
                  position: "top-right",
                });
                return;
              }

              toast.success("Gasto eliminado", {
                description: "El gasto ha sido eliminado correctamente.",
                position: "top-right",
              });
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
    <div className="gap-6 flex flex-col w-full">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Gastos</CardTitle>
          <CardDescription>
            Total de gastos registrados hasta la fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${getTotalExpenses().toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="registro">Registro</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          {activeTab === "historial" && <ExportDataButton type="expenses" />}
        </div>

        <TabsContent value="registro">
          <Card>
            <CardHeader>
              <CardTitle>Registrar nuevo gasto</CardTitle>
              <CardDescription>
                Ingresa los detalles del gasto operativo o financiero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial de gastos</CardTitle>
              <CardDescription>
                Listado de todos los gastos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={expenses}
                searchKey="concept"
                searchPlaceholder="Buscar por concepto..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
