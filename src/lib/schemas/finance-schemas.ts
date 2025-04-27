import { z } from "zod"

export const incomeFormSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  concept: z.string().min(3, {
    message: "El concepto debe tener al menos 3 caracteres",
  }),
  quantity: z.coerce.number().positive({
    message: "La cantidad debe ser un número positivo",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo",
  }),
})

export const costFormSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  concept: z.string().min(3, {
    message: "El concepto debe tener al menos 3 caracteres",
  }),
  quantity: z.coerce.number().positive({
    message: "La cantidad debe ser un número positivo",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo",
  }),
})

export const expenseFormSchema = z.object({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  concept: z.string().min(3, {
    message: "El concepto debe tener al menos 3 caracteres",
  }),
  category: z.enum(["operativo", "financiero"], {
    required_error: "La categoría es requerida",
  }),
  amount: z.coerce.number().positive({
    message: "El monto debe ser un número positivo",
  }),
})

export type IncomeFormValues = z.infer<typeof incomeFormSchema>
export type CostFormValues = z.infer<typeof costFormSchema>
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>
