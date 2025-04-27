"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/lib/schemas/finance-schemas";
import { type LoginFormValues } from "@/lib/schemas/finance-schemas";
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
import { authenticateCredentials } from "@/app/actions/authenticateCredentials";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    authenticateCredentials(undefined, values).then((error) => {
      if (error) {
        toast.error(error, {
          position: "top-right",
        });
      } else {
        toast.success("Inicio de sesión exitoso", {
          position: "top-right",
        });
      }
    });
  }

  function onClickSubmit() {
    if (!isValid) {
      toast.error("Por favor, completa todos los campos requeridos.", {
        position: "top-right",
      });
    }
  }

  const onGoogleLogin = () => {
    signIn("google");
  };

  const { isValid, isSubmitted } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Ingresa tu correo electrónico a continuación para iniciar sesión en
            tu cuenta
          </p>
        </div>
        <div className="grid gap-6">
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
                  <div className="flex items-center justify-between w-full">
                    <FormLabel>Contraseña</FormLabel>
                    <Link
                      href="/auth/recover"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <FormControl>
                    <Input placeholder="*******" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            onClick={onClickSubmit}
            variant="default"
            type="submit"
            className="w-full"
          >
            {isSubmitted && isValid ? "Cargando..." : "Iniciar sesión"}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              O continúa con
            </span>
          </div>
          <Button
            onClick={onGoogleLogin}
            type="button"
            variant="outline"
            className="w-full"
          >
            <FcGoogle />
            Iniciar sesión con Google
          </Button>
        </div>
        <div className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/register" className="underline underline-offset-4">
            Regístrate
          </Link>
        </div>
      </form>
    </Form>
  );
}
