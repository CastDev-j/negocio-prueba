"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LineChart,
  Package,
  ShoppingCart,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    title: "Ingresos",
    href: "/ingresos",
    icon: DollarSign,
  },
  {
    title: "Costos",
    href: "/costos",
    icon: ShoppingCart,
  },
  {
    title: "Gastos",
    href: "/gastos",
    icon: CreditCard,
  },
  {
    title: "Estado de Resultados",
    href: "/estado-resultados",
    icon: BarChart3,
  },
  {
    title: "Flujo de Caja",
    href: "/flujo-caja",
    icon: LineChart,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, isMobile} = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Package className="h-6 w-6" />
          <span className="text-xl font-bold">FinanzaPyme</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.href}
              onClick={() => isMobile && toggleSidebar()}
            >
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
