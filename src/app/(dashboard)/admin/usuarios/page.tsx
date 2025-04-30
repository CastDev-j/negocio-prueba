import { getUsers } from "@/app/actions/users/users";
import { UsersComponent } from "./ui/user-component";
import { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "FinanzaPyme - Usuarios",
  description: "Controla los usuarios de tu negocio",
};

export default async function UserPage() {
  const session = await auth();

  const { success, data } = (await getUsers()) || [];

  const users = success ? data : [];



  return (
    <div className="flex flex-col mx-auto py-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Aquí puedes ver todos los usuarios que han sido creados en el sistema.
        </p>
      </div>

      <UsersComponent users={users!} session={session!} />
    </div>
  );
}
