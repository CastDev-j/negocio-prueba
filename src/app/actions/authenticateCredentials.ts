"use server";

import { signIn } from "@/auth";
import { LoginFormValues } from "@/lib/schemas/finance-schemas";

interface ErrorResponse {
  type: string;
}

export async function authenticateCredentials(
  prevState: string | undefined,
  formData: LoginFormValues
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (typeof error === "object" && error !== null && "type" in error) {
      const typedError = error as ErrorResponse;
      switch (typedError.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas. Por favor, verifica tu correo electrónico y contraseña.";
        default:
          return "Error desconocido. Por favor, intenta nuevamente más tarde.";
      }
    }
    throw error;
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "type" in error) {
      const typedError = error as ErrorResponse;
      switch (typedError.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas. Por favor, verifica tu correo electrónico y contraseña.";
        default:
          return "Error desconocido. Por favor, intenta nuevamente más tarde.";
      }
    }
    throw error;
  }
};
