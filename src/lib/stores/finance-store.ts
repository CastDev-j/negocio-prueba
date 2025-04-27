import { create } from "zustand"
import { persist } from "zustand/middleware"

export type IncomeItem = {
  id: string
  date: Date
  concept: string
  quantity: number
  price: number
  total: number
}

export type CostItem = {
  id: string
  date: Date
  concept: string
  quantity: number
  price: number
  total: number
}

export type ExpenseItem = {
  id: string
  date: Date
  concept: string
  category: "operativo" | "financiero"
  amount: number
}

type FinanceStore = {
  incomes: IncomeItem[]
  costs: CostItem[]
  expenses: ExpenseItem[]
  addIncome: (income: Omit<IncomeItem, "id" | "total">) => void
  addCost: (cost: Omit<CostItem, "id" | "total">) => void
  addExpense: (expense: Omit<ExpenseItem, "id">) => void
  deleteIncome: (id: string) => void
  deleteCost: (id: string) => void
  deleteExpense: (id: string) => void
  getTotalIncomes: () => number
  getTotalCosts: () => number
  getTotalExpenses: () => number
  getProfit: () => number
  getCashFlow: () => Array<{ date: string; balance: number }>
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      incomes: [],
      costs: [],
      expenses: [],

      addIncome: (income) => {
        const total = income.quantity * income.price
        const newIncome = {
          ...income,
          id: crypto.randomUUID(),
          total,
        }
        set((state) => ({
          incomes: [...state.incomes, newIncome],
        }))
      },

      addCost: (cost) => {
        const total = cost.quantity * cost.price
        const newCost = {
          ...cost,
          id: crypto.randomUUID(),
          total,
        }
        set((state) => ({
          costs: [...state.costs, newCost],
        }))
      },

      addExpense: (expense) => {
        const newExpense = {
          ...expense,
          id: crypto.randomUUID(),
        }
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }))
      },

      deleteIncome: (id) => {
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        }))
      },

      deleteCost: (id) => {
        set((state) => ({
          costs: state.costs.filter((cost) => cost.id !== id),
        }))
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }))
      },

      getTotalIncomes: () => {
        return get().incomes.reduce((acc, income) => acc + income.total, 0)
      },

      getTotalCosts: () => {
        return get().costs.reduce((acc, cost) => acc + cost.total, 0)
      },

      getTotalExpenses: () => {
        return get().expenses.reduce((acc, expense) => acc + expense.amount, 0)
      },

      getProfit: () => {
        return get().getTotalIncomes() - get().getTotalCosts() - get().getTotalExpenses()
      },

      getCashFlow: () => {
        const allTransactions = [
          ...get().incomes.map((i) => ({
            date: new Date(i.date),
            amount: i.total,
            type: "income" as const,
          })),
          ...get().costs.map((c) => ({
            date: new Date(c.date),
            amount: -c.total,
            type: "cost" as const,
          })),
          ...get().expenses.map((e) => ({
            date: new Date(e.date),
            amount: -e.amount,
            type: "expense" as const,
          })),
        ].sort((a, b) => a.date.getTime() - b.date.getTime())

        // Agrupar por fecha
        const groupedByDate = allTransactions.reduce(
          (acc, transaction) => {
            const dateStr = transaction.date.toISOString().split("T")[0]
            if (!acc[dateStr]) {
              acc[dateStr] = 0
            }
            acc[dateStr] += transaction.amount
            return acc
          },
          {} as Record<string, number>,
        )

        // Convertir a array y calcular balance acumulado
        let balance = 0
        return Object.entries(groupedByDate)
          .map(([date, amount]) => {
            balance += amount
            return { date, balance }
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      },
    }),
    {
      name: "finance-storage",
    },
  ),
)
