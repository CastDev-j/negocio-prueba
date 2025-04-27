"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { useToast } from "@/hooks/use-toast"

type ExportType = "incomes" | "costs" | "expenses" | "all"

export function ExportDataButton({ type = "all" }: { type?: ExportType }) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
  const { incomes, costs, expenses } = useFinanceStore()

  const exportToCSV = () => {
    setIsExporting(true)

    try {
      let data: any[] = []
      let filename = ""
      let headers = ""

      if (type === "incomes" || type === "all") {
        const incomeData = incomes.map((income) => ({
          ...income,
          date: new Date(income.date).toLocaleDateString(),
          type: "Ingreso",
        }))
        data = [...data, ...incomeData]
        filename = type === "incomes" ? "ingresos.csv" : "datos_financieros.csv"
        headers = "Tipo,Fecha,Concepto,Cantidad,Precio,Total\n"
      }

      if (type === "costs" || type === "all") {
        const costData = costs.map((cost) => ({
          ...cost,
          date: new Date(cost.date).toLocaleDateString(),
          type: "Costo",
        }))
        data = [...data, ...costData]
        filename = type === "costs" ? "costos.csv" : filename || "datos_financieros.csv"
        headers = headers || "Tipo,Fecha,Concepto,Cantidad,Precio,Total\n"
      }

      if (type === "expenses" || type === "all") {
        const expenseData = expenses.map((expense) => ({
          ...expense,
          date: new Date(expense.date).toLocaleDateString(),
          type: "Gasto",
          quantity: 1,
          price: expense.amount,
          total: expense.amount,
        }))
        data = [...data, ...expenseData]
        filename = type === "expenses" ? "gastos.csv" : filename || "datos_financieros.csv"
        headers = headers || "Tipo,Fecha,Concepto,Cantidad,Precio,Total\n"
      }

      // Crear el contenido del CSV
      let csvContent = headers

      data.forEach((item) => {
        const row = [item.type, item.date, item.concept, item.quantity, item.price, item.total].join(",")
        csvContent += row + "\n"
      })

      // Crear y descargar el archivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Datos exportados",
        description: `Los datos han sido exportados a ${filename}`,
      })
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "Ha ocurrido un error al exportar los datos.",
        variant: "destructive",
      })
      console.error("Error al exportar datos:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={exportToCSV} disabled={isExporting}>
      <Download className="mr-2 h-4 w-4" />
      Exportar a CSV
    </Button>
  )
}
