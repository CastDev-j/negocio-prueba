"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { ExportDataButton } from "@/components/export-data-button"

export default function ProfitLossPage() {
  const { getTotalIncomes, getTotalCosts, getTotalExpenses, getProfit } = useFinanceStore()

  const totalIncomes = getTotalIncomes()
  const totalCosts = getTotalCosts()
  const totalExpenses = getTotalExpenses()
  const profit = getProfit()

  const isProfitable = profit >= 0

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estado de Resultados</h1>
          <p className="text-muted-foreground mt-2">Resumen de ingresos, costos, gastos y ganancias</p>
        </div>
        <ExportDataButton type="all" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncomes.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Costos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">${totalCosts.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ganancia/Pérdida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isProfitable ? "text-green-600" : "text-red-600"}`}>
              ${profit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Análisis Detallado</CardTitle>
            <CardDescription>Desglose de ingresos, costos y gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Resumen de Operaciones</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Ingresos Totales</span>
                    <span className="text-green-600">${totalIncomes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Costos de Producción</span>
                    <span className="text-amber-600">- ${totalCosts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Utilidad Bruta</span>
                    <span className={totalIncomes - totalCosts >= 0 ? "text-green-600" : "text-red-600"}>
                      ${(totalIncomes - totalCosts).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Gastos Operativos y Financieros</span>
                    <span className="text-orange-600">- ${totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b font-bold">
                    <span>Utilidad Neta</span>
                    <span className={isProfitable ? "text-green-600" : "text-red-600"}>${profit.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Indicadores Financieros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Margen Bruto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {totalIncomes > 0
                          ? `${(((totalIncomes - totalCosts) / totalIncomes) * 100).toFixed(2)}%`
                          : "N/A"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Margen Neto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {totalIncomes > 0 ? `${((profit / totalIncomes) * 100).toFixed(2)}%` : "N/A"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Ratio Costo/Ingreso</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {totalIncomes > 0 ? `${((totalCosts / totalIncomes) * 100).toFixed(2)}%` : "N/A"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
