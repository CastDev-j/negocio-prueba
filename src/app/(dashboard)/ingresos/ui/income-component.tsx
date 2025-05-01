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
import { IncomeForm } from "@/components/income-form";
import { ExportDataButton } from "@/components/export-data-button";
import { IncomeItem } from "@/interfaces/store";
import { IncomeTable } from "@/components/incomes-table";

interface IncomeComponentProps {
  incomes: IncomeItem[];
}

export const IncomeComponent: FC<IncomeComponentProps> = ({ incomes }) => {
  const [activeTab, setActiveTab] = useState("registro");

  const getTotalIncomes = () => {
    return incomes.reduce((total, income) => {
      return total + income.total;
    }, 0);
  };

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
              <IncomeTable incomes={incomes} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
