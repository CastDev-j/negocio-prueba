"use client";

import { authErrorMessages, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "@/lib/schemas/finance-schemas";
import { type RegisterFormValues } from "@/lib/schemas/finance-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { saveCredentialUser } from "@/app/actions/saveCredentialUser";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const params = useSearchParams();
  const error = params.get("error");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    const credentials = await saveCredentialUser(values);

    if (!credentials) return;

    signIn("credentials", values);
  }

  function onClickSubmit() {
    if (!isValid) {
      toast.error("Por favor, completa todos los campos requeridos.", {
        position: "top-right",
      });
    }
  }

  function onGoogleRegister() {
    signIn("google");
  }

  const { isValid, isSubmitted } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Crea una cuenta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Ingresa tus datos a continuación para registrarte
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && (
            <div className="grid gap-3">
              <Alert variant={"destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>¡Hubo un error!</AlertTitle>
                <AlertDescription>
                  {authErrorMessages[error] ||
                    "Error desconocido. Por favor, inténtalo de nuevo."}
                </AlertDescription>
              </Alert>
            </div>
          )}
          <Button
            onClick={onClickSubmit}
            variant="default"
            type="submit"
            className="w-full"
          >
            {isSubmitted && isValid ? "Cargando..." : "Registrarse"}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              O regístrate con
            </span>
          </div>
          <Button
            onClick={onGoogleRegister}
            type="button"
            variant="outline"
            className="w-full"
          >
            <FcGoogle />
            Registrarse con Google
          </Button>
        </div>
        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Inicia sesión
          </Link>
        </div>
      </form>
    </Form>
  );
}
