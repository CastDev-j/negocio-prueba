import type React from "react";
import type { Metadata } from "next/types";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/app/globals.css";
import { CustomTrigger } from "@/components/custrom-trigger";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "FinanzaPyme - Gestión Financiera para Pequeños Negocios",
  description: "Aplicación de gestión financiera para pequeños negocios",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar session={session} />
        <main className="flex flex-col w-full p-4 justify-start">
          <CustomTrigger />
          {children}

          <footer>
            <div className="flex flex-col items-center justify-center w-full h-16">
              <p className="text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} FinanzaPyme. Todos los
                derechos reservados.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}
