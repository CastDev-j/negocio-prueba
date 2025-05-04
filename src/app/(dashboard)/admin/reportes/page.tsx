import { auth } from "@/auth";
import { ReportComponent } from "./ui/report-component";
import { Metadata } from "next";
import { getUsers } from "@/app/actions/users/users";

export const metadata: Metadata = {
  title: "FinanzaPyme - Reportes Avanzados",
  description: "Aquí puedes ver los reportes avanzados de tu negocio",
};

export default async function UserPage() {
  const session = await auth();

  const { success, data } = (await getUsers()) || [];

  const users = success ? data : [];

  return (
    <div className="flex flex-col mx-auto py-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Reportes Avanzados
        </h1>
        <p className="text-muted-foreground mt-2">
          Aquí puedes ver los reportes de tu negocio. y puedes imprimir formatos
          especiales.
        </p>
      </div>

      <ReportComponent users={users!} session={session!}/>
    </div>
  );
}
