"use client";

import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseForm } from "@/components/expense-form";
import { ExportDataButton } from "@/components/export-data-button";
import { ExpenseItem } from "@/interfaces/store";
import { ExpencesTable } from "@/components/expences-table";

interface ExpensesComponentProps {
  expenses: ExpenseItem[];
}

export const ExpensesComponent: FC<ExpensesComponentProps> = ({ expenses }) => {
  const [activeTab, setActiveTab] = useState("registro");

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => {
      return total + expense.amount;
    }, 0);
  };

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
              <ExpencesTable expenses={expenses} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
