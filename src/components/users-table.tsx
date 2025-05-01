import React from "react";

import { FC } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2, FileText, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $Enums } from "@/app/generated/prisma";
import { Session } from "next-auth";
import { changeUserRole } from "@/app/actions/users/users";

interface User {
  id: string;
  name: string;
  email: string;
  role: $Enums.Role;
}

const roleEs = {
  admin: "Administrador",
  user: "Usuario",
};

interface UserTableProps {
  users: User[];
  session: Session;
  setActiveTab: (tab: string) => void;
  setSelectedUser: (user: User | null) => void;
  setUserToDelete: (user: string) => void;
  setShowDeleteDialog: (show: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const UsersTable: FC<UserTableProps> = ({
  isSubmitting,
  session,
  setActiveTab,
  setIsSubmitting,
  setSelectedUser,
  setShowDeleteDialog,
  setUserToDelete,
  users,
}) => {
  const handleRoleChange = async (
    email: string,
    newRole: keyof typeof roleEs
  ) => {
    const { data, success } = await changeUserRole(
      email,
      newRole as $Enums.Role
    );

    if (!success) {
      toast.error("Error al cambiar rol", {
        description: "No se pudo cambiar el rol del usuario.",
        position: "top-right",
      });
      return;
    }

    const updatedUser = data;

    if (updatedUser) {
      toast.success("Rol actualizado", {
        description: `El rol del usuario ${email} ha sido actualizado a ${roleEs[newRole]}`,
        position: "top-right",
      });
    }

    setIsSubmitting(false);
    setSelectedUser(null);
    setActiveTab("ingresos");
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div
          className="font-medium cursor-pointer hover:text-primary"
          onClick={() => setSelectedUser(row.original)}
        >
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Correo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Select
            defaultValue={user.role}
            disabled={session.user.email === user.email}
            onValueChange={(value) =>
              handleRoleChange(user.email, value as keyof typeof roleEs)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "view-records",
      header: "Registros",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedUser(user);
              setActiveTab("ingresos");
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver registros
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            disabled={
              isSubmitting ||
              session.user.email === user.email ||
              user.role === "admin"
            }
            onClick={() => {
              setUserToDelete(user.email.toLowerCase());
              setShowDeleteDialog(true);
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
      data={users}
      searchKey="name"
      searchPlaceholder="Buscar por nombre..."
    />
  );
};
