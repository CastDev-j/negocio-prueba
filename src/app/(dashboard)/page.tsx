import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  LineChart,
  ShoppingCart,
} from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión Financiera para Pequeños Negocios
        </h1>
        <p className="text-muted-foreground mt-2">
          Controla tus finanzas de manera sencilla y efectiva
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <div className="size-6 bg-primary text-primary-foreground rounded flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Registra tus ventas</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registra todas tus ventas con detalle de cantidad, precio y fecha.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costos</CardTitle>
            <div className="size-6 bg-primary text-primary-foreground rounded flex items-center justify-center">
              <ShoppingCart className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Controla tus compras</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registra las compras a proveedores y materiales para producción.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <div className="size-6 bg-primary text-primary-foreground rounded flex items-center justify-center">
              <CreditCard className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Administra tus gastos</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registra gastos operativos y financieros para un mejor control.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado de Resultados
            </CardTitle>
            <div className="size-6 bg-primary text-primary-foreground rounded flex items-center justify-center">
              <BarChart3 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Analiza tu rentabilidad</div>
            <p className="text-xs text-muted-foreground mt-1">
              Visualiza tus ingresos, costos, gastos y ganancias en un solo
              lugar.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flujo de Caja</CardTitle>
            <div className="size-6 bg-primary text-primary-foreground rounded flex items-center justify-center">
              <LineChart className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Monitorea tu liquidez</div>
            <p className="text-xs text-muted-foreground mt-1">
              Visualiza el movimiento de tu dinero a lo largo del tiempo.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Guía de uso</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cómo registrar datos</CardTitle>
              <CardDescription>
                Pasos para registrar ingresos, costos y gastos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Navega a la sección correspondiente desde el menú lateral.
                </li>
                <li>Completa el formulario con la información requerida.</li>
                <li>
                  Haz clic en el botón &quot;Registrar&quot; para guardar los
                  datos.
                </li>
                <li>
                  Verifica que los datos aparezcan en la tabla correspondiente.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cómo interpretar resultados</CardTitle>
              <CardDescription>
                Entendiendo los informes financieros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Estado de Resultados:</strong> Muestra si tu negocio
                  está generando ganancias o pérdidas.
                </li>
                <li>
                  <strong>Flujo de Caja:</strong> Indica la disponibilidad de
                  efectivo en diferentes momentos.
                </li>
                <li>
                  <strong>Exportación de datos:</strong> Permite descargar la
                  información para análisis externos.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
