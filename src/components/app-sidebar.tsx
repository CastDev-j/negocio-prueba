"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
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
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

const menuItems = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
    security: "public",
  },
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
  {
    title: "Admin",
    href: "/admin",
    icon: Package,
    security: "admin",
  },
];

export function AppSidebar() {
  const { data: session } = useSession();

  const isUserLoggedIn = !!session?.user;

  const userRole: "admin" | "user" | "public" = session?.user?.role === "admin"
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
    if (item.security === "admin" && userRole === "admin") return true;
    return false;
  });

  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();

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
                    <Button
                      variant="ghost"
                      className="flex justify-start w-full"
                    >
                      <User2 className="mr-2 h-4 w-4" />
                      <Link href={"/auth/login"}>Iniciar Sesión</Link>
                    </Button>
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
