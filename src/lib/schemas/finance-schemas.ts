import { z } from "zod";

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
});

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
});

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
});

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico no es válido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

export const registerFormSchema = z
  .object({
    email: z
      .string()
      .email({
        message: "El correo electrónico no es válido",
      })
      .min(1, {
        message: "El correo electrónico es requerido",
      })
      .max(100, {
        message: "El correo electrónico no puede tener más de 100 caracteres",
      }),
    name: z
      .string()
      .min(2, {
        message: "El nombre es requerido",
      })
      .max(100, {
        message: "El nombre no puede tener más de 100 caracteres",
      }),
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
    confirmPassword: z.string().min(6, {
      message: "La confirmación de la contraseña es requerida",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const recoverFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "El correo electrónico no es válido",
    })
    .min(1, {
      message: "El correo electrónico es requerido",
    })
    .max(100, {
      message: "El correo electrónico no puede tener más de 100 caracteres",
    }),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type RecoverFormValues = z.infer<typeof recoverFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type IncomeFormValues = z.infer<typeof incomeFormSchema>;
export type CostFormValues = z.infer<typeof costFormSchema>;
export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
