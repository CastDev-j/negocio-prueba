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
import { IncomeForm } from "@/components/income-form";
import { ExportDataButton } from "@/components/export-data-button";
import { toast } from "sonner";
import { deleteIncome } from "@/app/actions/expences/incomes";
import { IncomeItem } from "@/interfaces/store";

interface IncomeComponentProps {
  incomes: IncomeItem[];
}

export const IncomeComponent: FC<IncomeComponentProps> = ({ incomes }) => {
  const [activeTab, setActiveTab] = useState("registro");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTotalIncomes = () => {
    return incomes.reduce((total, income) => {
      return total + income.total;
    }, 0);
  };

  const columns: ColumnDef<IncomeItem>[] = [
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
      accessorKey: "quantity",
      header: "Cantidad",
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"));
        return `$${price.toFixed(2)}`;
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total = Number.parseFloat(row.getValue("total"));
        return `$${total.toFixed(2)}`;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const income = row.original;

        return (
          <Button
            variant="ghost"
            size="icon"
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              const deletedIncome = await deleteIncome(income.id);

              if (!deletedIncome) {
                toast.error("Error al eliminar el ingreso", {
                  description: "No se pudo eliminar el ingreso.",
                  position: "top-right",
                });
                return;
              }

              toast.success("Ingreso eliminado", {
                description: "El ingreso ha sido eliminado correctamente.",
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
          <CardTitle>Resumen de Ingresos</CardTitle>
          <CardDescription>
            Total de ingresos registrados hasta la fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${getTotalIncomes().toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="registro">Registro</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          {activeTab === "historial" && <ExportDataButton type="incomes" />}
        </div>

        <TabsContent value="registro">
          <Card>
            <CardHeader>
              <CardTitle>Registrar nuevo ingreso</CardTitle>
              <CardDescription>
                Ingresa los detalles de la venta o ingreso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial de ingresos</CardTitle>
              <CardDescription>
                Listado de todos los ingresos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={incomes}
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
