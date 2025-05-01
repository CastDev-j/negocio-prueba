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
import { CostForm } from "@/components/cost-form";
import { ExportDataButton } from "@/components/export-data-button";
import { CostItem } from "@/interfaces/store";
import { CostsTable } from "@/components/costs-table";

interface CostsComponentProps {
  costs: CostItem[];
}

export const CostsComponent: FC<CostsComponentProps> = ({ costs }) => {
  const [activeTab, setActiveTab] = useState("registro");

  const getTotalCosts = () => {
    return costs.reduce((total, cost) => {
      return total + cost.total;
    }, 0);
  };

  return (
    <div className="gap-6 flex flex-col w-full">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Costos</CardTitle>
          <CardDescription>
            Total de costos registrados hasta la fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${getTotalCosts().toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="registro">Registro</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          {activeTab === "historial" && <ExportDataButton type="costs" />}
        </div>

        <TabsContent value="registro">
          <Card>
            <CardHeader>
              <CardTitle>Registrar nuevo costo</CardTitle>
              <CardDescription>
                Ingresa los detalles de la compra o costo de producción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CostForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle>Historial de costos</CardTitle>
              <CardDescription>
                Listado de todos los costos registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CostsTable costs={costs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
