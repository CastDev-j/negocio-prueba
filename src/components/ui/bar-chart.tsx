"use client";

import { TrendingUp, TrendingDown, MoveRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface FinancialData {
  ingresos: number;
  costos: number;
  gastos: number;
  balance?: number;
  fecha?: string;
}

interface BarChartCardProps {
  data: FinancialData[];
  config: ChartConfig;
  title: string;
  description?: string;
  showBalance?: boolean;
  aspectRatio?: number;
  maxWidth?: string;
  reverseData?: boolean; // Nueva prop para controlar reversión
}

export const BarChartCard = ({
  data,
  config,
  title,
  description,
  showBalance = true,
  aspectRatio = 16 / 9,
  maxWidth = "100%",
  reverseData = true,
}: BarChartCardProps) => {
  const processedData = reverseData ? [...data].reverse() : [...data];

  const chartData = processedData.map((item) => ({
    ...item,
    balance: item.balance ?? item.ingresos - item.costos - item.gastos,
  }));

  const getMonthlyComparison = () => {
    if (chartData.length < 2)
      return {
        value: "N/A",
        description: "Se necesitan ≥2 meses para comparar",
        direction: "neutral" as const,
        isValid: false,
      };

    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const isValidComparison =
      current.fecha &&
      previous.fecha &&
      current.balance !== undefined &&
      previous.balance !== undefined;

    if (!isValidComparison)
      return {
        value: "N/A",
        description: "Datos incompletos para comparar",
        direction: "neutral" as const,
        isValid: false,
      };

    const difference = current.balance - previous.balance;
    const percentage = (difference / Math.abs(previous.balance)) * 100;

    const displayValue =
      Math.abs(percentage) > 10000
        ? `${difference > 0 ? "+" : "-"}∞%`
        : `${difference >= 0 ? "+" : ""}${Math.abs(percentage).toFixed(1)}%`;

    return {
      value: displayValue,
      description: `Vs ${previous.fecha}`,
      direction: difference > 0 ? "up" : difference < 0 ? "down" : "neutral",
      isValid: true,
    };
  };

  const comparison = getMonthlyComparison();

  const lastBalance =
    chartData.length > 0 ? chartData[chartData.length - 1].balance : 0;
  const totalBalance = chartData.reduce(
    (sum, item) => sum + (item.balance || 0),
    0
  );

  return (
    <Card className="flex flex-col" style={{ maxWidth }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-4 min-h-[300px]">
        <div className="h-full w-full">
          <ChartContainer config={config}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              aspect={aspectRatio}
            >
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="fecha"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />
                <Bar
                  dataKey="ingresos"
                  fill={config.ingresos?.color || "hsl(var(--primary))"}
                  radius={[4, 4, 0, 0]}
                  name={config.ingresos?.label?.toString() || "Ingresos"}
                />
                <Bar
                  dataKey="costos"
                  fill={config.costos?.color || "hsl(var(--destructive))"}
                  radius={[4, 4, 0, 0]}
                  name={config.costos?.label?.toString() || "Costos"}
                />
                <Bar
                  dataKey="gastos"
                  fill={config.gastos?.color || "hsl(var(--warning))"}
                  radius={[4, 4, 0, 0]}
                  name={config.gastos?.label?.toString() || "Gastos"}
                />
                {showBalance && (
                  <Bar
                    dataKey="balance"
                    fill={config.balance?.color || "hsl(var(--success))"}
                    radius={[4, 4, 0, 0]}
                    name={config.balance?.label?.toString() || "Balance"}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-1 pt-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          {comparison.direction === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : comparison.direction === "down" ? (
            <TrendingDown className="h-4 w-4 text-red-500" />
          ) : (
            <MoveRight className="h-4 w-4 text-gray-500" />
          )}
          <span>{comparison.value}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {comparison.description}
          {!comparison.isValid && " (comparación no disponible)"}
        </p>
        {showBalance && (
          <div className="grid grid-cols-2 gap-4 w-full mt-2">
            <div>
              <p className="text-xs text-muted-foreground">Mes Actual:</p>
              <p
                className={`text-sm font-medium ${
                  lastBalance >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ${lastBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Acumulado:</p>
              <p
                className={`text-sm font-medium ${
                  totalBalance >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ${totalBalance.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
