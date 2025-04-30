"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronUp,
  CreditCard,
  DollarSign,
  DoorOpenIcon,
  Home,
  LineChart,
  Package,
  ShoppingCart,
  User2,
  Users,
  FileSearch,
  DownloadCloud,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Session } from "next-auth";

const menuItems = [
  // --- RUTAS PÚBLICAS ---
  {
    title: "Inicio",
    href: "/",
    icon: Home,
    security: "public",
  },
  // --- RUTAS DE USUARIO ---
  {
    title: "Ingresos",
    href: "/ingresos",
    icon: DollarSign,
    security: "user",
  },
  {
    title: "Costos",
    href: "/costos",
    icon: ShoppingCart,
    security: "user",
  },
  {
    title: "Gastos",
    href: "/gastos",
    icon: CreditCard,
    security: "user",
  },
  {
    title: "Estado de Resultados",
    href: "/estado-resultados",
    icon: BarChart3,
    security: "user",
  },
  {
    title: "Flujo de Caja",
    href: "/flujo-caja",
    icon: LineChart,
    security: "user",
  },
];

const adminRoutes = [
  // --- CONFIGURACIÓN ---
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
    category: "configuracion",
  },

  // --- REPORTES AVANZADOS ---
  {
    title: "Reportes Avanzados",
    href: "/admin/reportes",
    icon: FileSearch,
    category: "reportes",
  },
  {
    title: "Exportar Datos",
    href: "/admin/exportar",
    icon: DownloadCloud,
    category: "reportes",
  },
];

interface SidebarProps {
  session: Session | null;
}

export function AppSidebar({ session }: SidebarProps) {
  const isUserLoggedIn = !!session?.user;
  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();

  const userRole: "admin" | "user" | "public" =
    session?.user?.role === "admin"
      ? "admin"
      : session?.user
      ? "user"
      : "public";

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.security === "public") return true;
    if (
      item.security === "user" &&
      (userRole === "admin" || userRole === "user")
    )
      return true;
    return false;
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Package className="size-6" />
          </span>
          <span className="font-bold text-xl">FinanzaPyme. </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredMenuItems.map((item) => (
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

          {userRole === "admin" && (
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rutas Administrador
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                {adminRoutes.map((route) => (
                  <SidebarMenuItem
                    key={route.href}
                    onClick={() => isMobile && toggleSidebar()}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === route.href}
                      tooltip={route.title}
                    >
                      <Link href={route.href}>
                        <route.icon className="h-5 w-5" />
                        <span>{route.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {isUserLoggedIn ? session.user.name : "Invitado"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {isUserLoggedIn ? (
                  <>
                    <DropdownMenuItem>
                      <Button
                        variant="ghost"
                        className="flex justify-start w-full"
                      >
                        <User2 className="mr-2 h-4 w-4" />
                        <span>Cuenta</span>
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button
                        onClick={() => signOut()}
                        variant="ghost"
                        className="flex justify-start w-full"
                      >
                        <DoorOpenIcon className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </Button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Link href={"/auth/login"}>
                      <Button
                        variant="ghost"
                        className="flex justify-start w-full"
                      >
                        <User2 className="mr-2 h-4 w-4" />
                        <span>Iniciar Sesión</span>
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
