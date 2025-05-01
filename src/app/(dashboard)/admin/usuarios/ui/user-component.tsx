"use client";

import { FC, useEffect, useState } from "react";
import { Users, Shield, FileText, PackageOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportDataButton } from "@/components/export-data-button";
import { toast } from "sonner";

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
import { deleteUser } from "@/app/actions/users/users";
import { CostItem, ExpenseItem, IncomeItem } from "@/interfaces/store";
import { getIncomesByUserId } from "@/app/actions/expences/incomes";
import { getCostsByUserId } from "@/app/actions/expences/costs";
import { getExpensesByUserId } from "@/app/actions/expences/expences";
import { IncomeTable } from "@/components/incomes-table";
import { CostsTable } from "@/components/costs-table";
import { ExpencesTable } from "@/components/expences-table";
import { DataTableSkeleton } from "@/components/ui/skeleton-table";
import { UsersTable } from "@/components/users-table";

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

export const UsersComponent: FC<UsersComponentProps> = ({ users, session }) => {
  const [activeTab, setActiveTab] = useState("ingresos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [revalidateKey, setRevalidateKey] = useState(0);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsSubmitting(true);
    const { success, data } = await deleteUser(userToDelete);

    if (!success) {
      toast.error("Error al eliminar usuario", {
        description: "No se pudo eliminar el usuario.",
        position: "top-right",
      });

      setIsSubmitting(false);
      setShowDeleteDialog(false);
      setUserToDelete(null);
      setSelectedUser(null);

      return;
    }

    const deletedUser = data;

    if (deletedUser) {
      toast.success("Usuario eliminado", {
        description: `El usuario ${userToDelete} ha sido eliminado.`,
        position: "top-right",
      });
    }

    setIsSubmitting(false);
    setShowDeleteDialog(false);
    setUserToDelete(null);
    setSelectedUser(null);
  };

  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true);
      const fetchUserData = async () => {
        const { data: userIncomes = [], success: successIncomes } =
          await getIncomesByUserId(selectedUser.id);
        const { data: userCosts = [], success: successCosts } =
          await getCostsByUserId(selectedUser.id);
        const { data: userExpenses = [], success: successExpenses } =
          await getExpensesByUserId(selectedUser.id);

        if (!successIncomes || !successCosts || !successExpenses) {
          toast.error("Error al obtener los datos del usuario", {
            description: "No se pudieron obtener los datos del usuario.",
            position: "top-right",
          });
          return;
        }

        const formattedIncomes = userIncomes.map((income) => {
          return {
            ...income,
            date: new Date(income.date),
          };
        });

        const formattedCosts = userCosts.map((cost) => {
          return {
            ...cost,
            date: new Date(cost.date),
          };
        });

        const formattedExpenses = userExpenses.map((expense) => {
          return {
            ...expense,
            date: new Date(expense.date),
          };
        });

        setIncomes(formattedIncomes);
        setCosts(formattedCosts);
        setExpenses(formattedExpenses);

        setIsLoading(false);
      };

      fetchUserData();
    }
  }, [selectedUser, revalidateKey]);

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
              <span className="text-destructive">
                Incluido su historial de ingresos, costos y gastos.
              </span>
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
          <UsersTable
            isSubmitting={isSubmitting}
            session={session}
            setActiveTab={setActiveTab}
            setIsSubmitting={setIsSubmitting}
            setSelectedUser={setSelectedUser}
            setShowDeleteDialog={setShowDeleteDialog}
            setUserToDelete={setUserToDelete}
            users={users}
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
          <ExportDataButton
            type="all"
            disabled={!selectedUser}
            userId={selectedUser?.id || undefined}
          />
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
                isLoading ? (
                  <DataTableSkeleton />
                ) : incomes.length > 0 ? (
                  <IncomeTable
                    setRevalidateKey={setRevalidateKey}
                    incomes={incomes}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">
                      No hay ingresos registrados
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Aún no se han registrado ingresos para este usuario.
                    </p>
                  </div>
                )
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
                isLoading ? (
                  <DataTableSkeleton />
                ) : costs.length > 0 ? (
                  <CostsTable
                    setRevalidateKey={setRevalidateKey}
                    costs={costs}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">
                      No hay costos registrados
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Aún no se han registrado costos para este usuario.
                    </p>
                  </div>
                )
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
                isLoading ? (
                  <DataTableSkeleton />
                ) : expenses.length > 0 ? (
                  <ExpencesTable
                    setRevalidateKey={setRevalidateKey}
                    expenses={expenses}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">
                      No hay gastos registrados
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Aún no se han registrado gastros para este usuario.
                    </p>
                  </div>
                )
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
