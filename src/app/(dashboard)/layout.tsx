import type React from "react";
import type { Metadata } from "next/types";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/app/globals.css";
import { CustomTrigger } from "@/components/custrom-trigger";


export const metadata: Metadata = {
  title: "FinanzaPyme - Gestión Financiera para Pequeños Negocios",
  description: "Aplicación de gestión financiera para pequeños negocios",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex flex-col w-full p-4 justify-start">
            <CustomTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
  );
}
