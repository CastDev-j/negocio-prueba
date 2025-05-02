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
import { CostItem, ExpenseItem, IncomeItem } from "@/interfaces/store";

interface CashFlowComponentProps {
  costs: IncomeItem[];
  incomes: CostItem[];
  expenses: ExpenseItem[];
}

export const FlowComponent: FC<CashFlowComponentProps> = ({
  costs,
  expenses,
  incomes,
}) => {
  const dateMap = new Map<
    string,
    { incomes: number; costs: number; expenses: number; date: Date }
  >();

  incomes.forEach((income) => {
    const dateStr = income.date.toISOString().split("T")[0];
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        incomes: 0,
        costs: 0,
        expenses: 0,
        date: new Date(dateStr),
      });
    }
    dateMap.get(dateStr)!.incomes += income.total;
  });

  costs.forEach((cost) => {
    const dateStr = cost.date.toISOString().split("T")[0];
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        incomes: 0,
        costs: 0,
        expenses: 0,
        date: new Date(dateStr),
      });
    }
    dateMap.get(dateStr)!.costs += cost.total;
  });

  expenses.forEach((expense) => {
    const dateStr = expense.date.toISOString().split("T")[0];
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        incomes: 0,
        costs: 0,
        expenses: 0,
        date: new Date(dateStr),
      });
    }
    dateMap.get(dateStr)!.expenses += expense.amount;
  });

  const sortedDates = Array.from(dateMap.entries()).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );

  let accumulatedBalance = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cashFlowData: CashFlowData[] = sortedDates.map(([_, amounts]) => {
    const dailyBalance = amounts.incomes - amounts.costs - amounts.expenses;
    accumulatedBalance += dailyBalance;

    return {
      date: amounts.date.toISOString(),
      incomes: amounts.incomes,
      costs: amounts.costs,
      expenses: amounts.expenses,
      dailyBalance,
      balance: accumulatedBalance,
    };
  });

  const displayData =
    cashFlowData.length > 0
      ? cashFlowData
      : Array.from({ length: 3 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: date.toISOString(),
            balance: 0,
            incomes: 0,
            costs: 0,
            expenses: 0,
            dailyBalance: 0,
          };
        }).reverse();

  const mockData = displayData || [];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Flujo de Caja</CardTitle>
          <CardDescription>Evolución del saldo acumulado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full ">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 30,
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
