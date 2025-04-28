import { getCosts } from "@/app/actions/expences/costs";
import { CostsComponent } from "./ui/cost-component";
import { CostItem } from "@/interfaces/store";

export default async function CostsPage() {
  const costs: CostItem[] =
    (await getCosts()).map((cost) => ({
      ...cost,
      date: new Date(cost.date),
    })) || [];

  return (
    <div className="flex flex-col mx-auto py-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Costos</h1>
        <p className="text-muted-foreground mt-2">
          Registra y administra los costos de producción de tu negocio
        </p>
      </div>

      <CostsComponent costs={costs} />
    </div>
  );
}
