"use client";

import { FC, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2, Users, Shield, FileText, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { ExportDataButton } from "@/components/export-data-button";
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
import { Progress } from "@/components/ui/progress";
import { $Enums } from "@/app/generated/prisma";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Session } from "next-auth";
import { changeUserRole, deleteUser } from "@/app/actions/users/users";

interface User {
  id: string;
  name: string;
  email: string;
  role: $Enums.Role;
}

interface UsersComponentProps {
  users: User[];
  session: Session;
}

const roleEs = {
  admin: "Administrador",
  user: "Usuario",
};

export const UsersComponent: FC<UsersComponentProps> = ({ users, session }) => {
  const [activeTab, setActiveTab] = useState("ingresos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleRoleChange = async (
    email: string,
    newRole: keyof typeof roleEs
  ) => {
    console.log(`Cambiando rol del usuario ${email} a ${newRole}`);
    // Aquí iría la lógica para actualizar el rol en la base de datos
    const updatedUser = await changeUserRole(email, newRole as $Enums.Role);

    if (updatedUser) {
      toast.success("Rol actualizado", {
        description: `El rol del usuario ${email} ha sido actualizado a ${roleEs[newRole]}`,
        position: "top-right",
      });
    } else {
      toast.error("Error al actualizar rol", {
        description: "No se pudo actualizar el rol del usuario.",
        position: "top-right",
      });
    }

    setIsSubmitting(false);
    setSelectedUser(null);
    setActiveTab("ingresos");
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsSubmitting(true);
    // Lógica para eliminar usuario
    console.log(`Eliminar usuario ${userToDelete}`);

    const deletedUser = await deleteUser(userToDelete);

    if (deletedUser) {
      toast.success("Usuario eliminado", {
        description: `El usuario ${userToDelete} ha sido eliminado.`,
        position: "top-right",
      });
    } else {
      toast.error("Error al eliminar usuario", {
        description: "No se pudo eliminar el usuario.",
        position: "top-right",
      });
    }

    setIsSubmitting(false);
    setShowDeleteDialog(false);
    setUserToDelete(null);
    setSelectedUser(null);
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
    <div className="gap-6 flex flex-col w-full">
      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de eliminar este usuario?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario será eliminado
              permanentemente.{" "}
              <span className="text-destructive">Incluido su historial de ingresos, costos y gastos.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resumen de Usuarios */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resumen de Usuarios</CardTitle>
          <CardDescription>Distribución de roles en el sistema</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg p-4 bg-card border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Administradores
                  </p>
                  <h3 className="text-2xl font-bold">
                    {users.filter((user) => user.role === "admin").length}
                  </h3>
                </div>
                <div className="rounded-full bg-primary/10 p-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-2">
                <Progress
                  value={
                    (users.filter((user) => user.role === "admin").length /
                      users.length) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>

            <div className="rounded-lg p-4 bg-card border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Usuarios regulares
                  </p>
                  <h3 className="text-2xl font-bold">
                    {users.filter((user) => user.role === "user").length}
                  </h3>
                </div>
                <div className="rounded-full bg-secondary/10 p-2">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <div className="mt-2">
                <Progress
                  value={
                    (users.filter((user) => user.role === "user").length /
                      users.length) *
                    100
                  }
                  className="h-2 bg-secondary"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Total registrados: {users.length}</span>
            <span>
              {new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Listado de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Usuarios</CardTitle>
          <CardDescription>
            Administra los usuarios y sus permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchKey="name"
            searchPlaceholder="Buscar por nombre..."
          />
        </CardContent>
      </Card>

      {/* Pestañas de Información Financiera */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="costos">Costos</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
          </TabsList>
          <ExportDataButton type="all" />
        </div>

        <TabsContent value="ingresos">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser ? `Ingresos de ${selectedUser.name}` : "Ingresos"}
              </CardTitle>
              <CardDescription>
                {selectedUser
                  ? "Historial de ingresos del usuario seleccionado"
                  : "Selecciona un usuario para ver sus ingresos"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div>
                  {/* Aquí iría la tabla de ingresos del usuario */}
                  <p>Tabla de ingresos para {selectedUser.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">
                    No se ha seleccionado ningún usuario
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Haz clic en &quot;Ver registros&quot; para ver la
                    información financiera de un usuario
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costos">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser ? `Costos de ${selectedUser.name}` : "Costos"}
              </CardTitle>
              <CardDescription>
                {selectedUser
                  ? "Historial de costos del usuario seleccionado"
                  : "Selecciona un usuario para ver sus costos"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div>
                  {/* Aquí iría la tabla de costos del usuario */}
                  <p>Tabla de costos para {selectedUser.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">
                    No se ha seleccionado ningún usuario
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Haz clic en &quot;Ver registros&quot; para ver la
                    información financiera de un usuario
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gastos">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser ? `Gastos de ${selectedUser.name}` : "Gastos"}
              </CardTitle>
              <CardDescription>
                {selectedUser
                  ? "Historial de gastos del usuario seleccionado"
                  : "Selecciona un usuario para ver sus gastos"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div>
                  {/* Aquí iría la tabla de gastos del usuario */}
                  <p>Tabla de gastos para {selectedUser.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">
                    No se ha seleccionado ningún usuario
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Haz clic en &quot;Ver registros&quot; para ver la
                    información financiera de un usuario
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
