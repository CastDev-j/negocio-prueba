"use client";

import React, { FC, useState } from "react";
import { DataTable } from "./ui/data-table";
import { Button } from "./ui/button";
import { CostItem } from "@/interfaces/store";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { deleteCost } from "@/app/actions/expences/costs";

interface CostsTableProps {
  costs: CostItem[];
  setRevalidateKey?: React.Dispatch<React.SetStateAction<number>>;
}

export const CostsTable: FC<CostsTableProps> = ({
  costs,
  setRevalidateKey,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns: ColumnDef<CostItem>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return format(date, "dd/MM/yyyy", { locale: es });
      },
    },
    {
      accessorKey: "concept",
      header: "Concepto",
    },
    {
      accessorKey: "quantity",
      header: "Cantidad",
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"));
        return `$${price.toFixed(2)}`;
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total = Number.parseFloat(row.getValue("total"));
        return `$${total.toFixed(2)}`;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const cost = row.original;

        return (
          <Button
            variant="ghost"
            size="icon"
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              const { success } = await deleteCost(cost.id);

              if (!success) {
                toast.error("Error al eliminar el costo", {
                  description: "No se pudo eliminar el costo.",
                  position: "top-right",
                });
                setIsSubmitting(false);
                return;
              }

              toast.success("Costo eliminado", {
                description: "El costo ha sido eliminado correctamente.",
                position: "top-right",
              });

              if (setRevalidateKey) setRevalidateKey((prev) => prev + 1);

              setIsSubmitting(false);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={costs}
      searchKey="concept"
      searchPlaceholder="Buscar por concepto..."
    />
  );
};
