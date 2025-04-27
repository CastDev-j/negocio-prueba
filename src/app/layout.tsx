import type React from "react";
import type { Metadata } from "next/types";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/app/globals.css";
import { CustomTrigger } from "@/components/custrom-trigger";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex flex-col w-full p-4 justify-start">
                <CustomTrigger />
                {children}
              </main>
            </div>
            <Toaster richColors />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
