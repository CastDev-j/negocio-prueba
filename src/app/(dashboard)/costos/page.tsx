"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { CostForm } from "@/components/cost-form"
import { ExportDataButton } from "@/components/export-data-button"
import { useFinanceStore, type CostItem } from "@/lib/stores/finance-store"
import { toast } from "sonner"

export default function CostsPage() {
  const { costs, deleteCost, getTotalCosts } = useFinanceStore()
  const [activeTab, setActiveTab] = useState("registro")

  const columns: ColumnDef<CostItem>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        return format(date, "dd/MM/yyyy", { locale: es })
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
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))
        return `$${price.toFixed(2)}`
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total = Number.parseFloat(row.getValue("total"))
        return `$${total.toFixed(2)}`
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const cost = row.original

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              deleteCost(cost.id)
              toast.success("Costo eliminado", {
                description: "El costo ha sido eliminado correctamente.",
                position: "top-right",

              })
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col mx-auto py-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Costos</h1>
        <p className="text-muted-foreground mt-2">Registra y administra los costos de producción de tu negocio</p>
      </div>

      <div className="gap-6 flex flex-col w-full">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Costos</CardTitle>
            <CardDescription>Total de costos registrados hasta la fecha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${getTotalCosts().toFixed(2)}</div>
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
                <CardDescription>Ingresa los detalles de la compra o costo de producción</CardDescription>
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
                <CardDescription>Listado de todos los costos registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={costs}
                  searchKey="concept"
                  searchPlaceholder="Buscar por concepto..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
