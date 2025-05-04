"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PieDataItem {
  name: string;
  value: number;
}

interface PieChartCardProps {
  data: PieDataItem[];
  title: string;
  description?: string;
  trend?: {
    value: string;
    description: string;
    positive: boolean;
  };
  config?: ChartConfig;
  aspectRatio?: number;
}

export const PieChartCard = ({
  data,
  title,
  description,
  trend = {
    value: "Estable",
    description: "Sin datos comparativos",
    positive: true,
  },
  config = {
    ingresos: { label: "Ingresos", color: "hsl(var(--primary))" },
    costos: { label: "Costos", color: "hsl(var(--destructive))" },
    gastos: { label: "Gastos", color: "hsl(var(--warning))" },
  },
  aspectRatio = 1,
}: PieChartCardProps) => {
  const colors = data.map((item) => {
    const key = item.name.toLowerCase() as keyof typeof config;
    return config[key]?.color || "#8884d8";
  });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-full w-full">
          <ChartContainer config={config}>
            <ResponsiveContainer
              width="100%"
              height="100%"
              aspect={aspectRatio}
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}  // Aumenta este valor
                  outerRadius={120} // Aumenta este valor
                  paddingAngle={5}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 pt-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          {trend.positive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span>{trend.value}</span>
        </div>
        <p className="text-xs text-muted-foreground">{trend.description}</p>
      </CardFooter>
    </Card>
  );
};
