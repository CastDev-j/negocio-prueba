import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authErrorMessages: Record<string, string> = {
  CredentialsSignin: "Credenciales inválidas, por favor intenta de nuevo.",
  OAuthCallback: "Error de autenticación, por favor intenta de nuevo.",
  OAuthCreateAccount: "Error al crear cuenta, por favor intenta de nuevo.",
  default: "Error desconocido, por favor intenta de nuevo más tarde.",
  EmailSignin:
    "Error al enviar el correo electrónico, por favor intenta de nuevo.",
  EmailCreateAccount: "Error al crear cuenta, por favor intenta de nuevo.",
  EmailVerification:
    "Error al verificar el correo electrónico, por favor intenta de nuevo.",
};
