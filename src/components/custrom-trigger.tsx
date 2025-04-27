"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const stateEs = {
  expanded: "Ocultar",
  collapsed: "Mostrar",
};

export function CustomTrigger() {
  const { toggleSidebar, state, isMobile } = useSidebar();

  return (
    <Button onClick={toggleSidebar} className="w-fit" variant="ghost">
      <Menu /> {isMobile ? stateEs.collapsed : stateEs[state]} Menu
    </Button>
  );
}
