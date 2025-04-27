"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { ExportDataButton } from "@/components/export-data-button"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CashFlowPage() {
  const { getCashFlow } = useFinanceStore()

  const cashFlowData = getCashFlow()

  // Si no hay datos, crear datos de ejemplo
  const mockData =
    cashFlowData.length > 0
      ? cashFlowData
      : [
          { date: "2023-01-01", balance: 1000 },
          { date: "2023-01-15", balance: 1500 },
          { date: "2023-02-01", balance: 1200 },
          { date: "2023-02-15", balance: 2000 },
          { date: "2023-03-01", balance: 1800 },
          { date: "2023-03-15", balance: 2500 },
        ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flujo de Caja</h1>
          <p className="text-muted-foreground mt-2">Visualización del saldo acumulado a lo largo del tiempo</p>
        </div>
        <ExportDataButton type="all" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gráfico de Flujo de Caja</CardTitle>
            <CardDescription>Evolución del saldo acumulado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getDate()}/${date.getMonth() + 1}`
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Saldo"]}
                    labelFormatter={(label) => {
                      const date = new Date(label)
                      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="balance" name="Saldo" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabla de Flujo de Caja</CardTitle>
            <CardDescription>Detalle del saldo acumulado por fecha</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Saldo Acumulado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={item.balance >= 0 ? "text-green-600" : "text-red-600"}>
                        ${item.balance.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
