import { revalidatePath } from "next/cache";

export const updatePaths = () => {
  revalidatePath("/ingresos");
  revalidatePath("/admin/reportes");
  revalidatePath("/admin/usuarios");
  revalidatePath("/estado-resultados");
  revalidatePath("/flujo-caja");
};
