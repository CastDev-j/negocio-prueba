"use client";

import { useEffect, useState } from "react";
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
import { useFinanceStore, type IncomeItem } from "@/lib/stores/finance-store";
import { toast } from "sonner";
import {
  getCounter,
  decrementCounter,
  incrementCounter,
  resetCounter,
} from "@/app/actions/test/counter";

export default function IncomesPage() {
  const { incomes, deleteIncome, getTotalIncomes } = useFinanceStore();
  const [activeTab, setActiveTab] = useState("registro");

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
            onClick={() => {
              deleteIncome(income.id);
              toast.success("Ingreso eliminado", {
                description: "El ingreso ha sido eliminado correctamente.",
                position: "top-right",
              });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCounter = async () => {
      const counter = await getCounter();
      setCount(counter.value);
    };
    fetchCounter();
  }, []);

  const incrementCount = () => {
    incrementCounter();
  };
  const decrementCount = () => {
    decrementCounter();
  };
  const resetCount = () => {
    resetCounter();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ingresos</h1>
        <p className="text-muted-foreground mt-2">
          Registra y administra los ingresos de tu negocio
        </p>

        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={decrementCount}
          >
            Decrementar
          </button>
          <span className="text-xl font-bold">{count}</span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={incrementCount}
          >
            Incrementar
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={resetCount}
          >
            Resetear
          </button>
        </div>
      </div>

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
    </div>
  );
}
