"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recoverFormSchema } from "@/lib/schemas/finance-schemas";
import { type RecoverFormValues } from "@/lib/schemas/finance-schemas";
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

export function RecoverForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: RecoverFormValues) {
    console.log("Recovery email sent to:", values.email);
    toast.success("Se ha enviado un enlace de recuperación a tu correo.", {
      position: "top-right",
    });
  }

  function onClickSubmit() {
    if (!isValid) {
      toast.error("Por favor, completa todos los campos requeridos.", {
        position: "top-right",
      });
    }
  }

  const { isValid } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Recupera tu cuenta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Ingresa tu correo electrónico a continuación para recuperar el
            acceso a tu cuenta.
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
          <Button
            variant="default"
            type="submit"
            className="w-full"
            onClick={onClickSubmit}
          >
            Enviar enlace de recuperación
          </Button>
        </div>
        <div className="text-center text-sm">
          ¿Recordaste tu contraseña?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Inicia sesión
          </Link>
        </div>
      </form>
    </Form>
  );
}
