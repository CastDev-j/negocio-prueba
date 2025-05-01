"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC } from "react";
import { CashFlowData } from "@/interfaces/flow";

interface CashFlowComponentProps {
  cashFlowData: CashFlowData[];
}

export const FlowComponent: FC<CashFlowComponentProps> = ({ cashFlowData }) => {
  const mockData = cashFlowData.length > 0 ? cashFlowData : [];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Flujo de Caja</CardTitle>
          <CardDescription>Evolución del saldo acumulado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Saldo"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return `${date.getDate()}/${
                      date.getMonth() + 1
                    }/${date.getFullYear()}`;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Saldo"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabla de Flujo de Caja</CardTitle>
          <CardDescription>
            Detalle del saldo acumulado por fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Saldo Acumulado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        item.balance >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      ${item.balance.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
