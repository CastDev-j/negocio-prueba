"use client";

import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  ArrowUpDown,
  Check,
  ChevronsUpDown,
  Ellipsis,
  PackageOpen,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import type { ColumnDef } from "@tanstack/react-table";
import type { Session, User } from "next-auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportDataButton } from "@/components/export-data-button";
import { toast } from "sonner";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import {
  getAdminIncomes,
  getIncomesByUserId,
} from "@/app/actions/expences/incomes";
import { getAdminCosts, getCostsByUserId } from "@/app/actions/expences/costs";
import {
  getAdminExpenses,
  getExpensesByUserId,
} from "@/app/actions/expences/expences";
import { CostItem, ExpenseItem, IncomeItem } from "@/interfaces/store";
import { IncomeTable } from "@/components/incomes-table";
import { CostsTable } from "@/components/costs-table";
import { ExpencesTable } from "@/components/expences-table";
import { BarChartCard } from "@/components/ui/bar-chart";
import { PieChartCard } from "@/components/ui/pie-chart";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ReportType =
  | "summary"
  | "incomes"
  | "costs"
  | "expenses"
  | "cashflow"
  | "results";

interface CashFlowItem {
  date: Date;
  type: string;
  concept: string;
  amount: number;
  category?: string;
}

interface FinancialData {
  ingresos: number;
  costos: number;
  gastos: number;
  fecha?: string;
}

interface ReportComponentProps {
  users: User[];
  session: Session;
}

export function ReportComponent({ users }: ReportComponentProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ReportType>("summary");
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<{
    incomes: IncomeItem[];
    costs: CostItem[];
    expenses: ExpenseItem[];
  }>({
    incomes: [],
    costs: [],
    expenses: [],
  });
  const [userComboboxOpen, setUserComboboxOpen] = useState(false);
  const [previousPeriodData, setPreviousPeriodData] =
    useState<FinancialData | null>(null);

  // Filtrar datos por rango de fechas
  const filteredData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return allData;

    const filterByDate = <T extends { date: Date | string }>(
      items: T[]
    ): T[] => {
      if (!items) return [];

      return items.filter((item) => {
        const itemDate =
          typeof item.date === "string" ? new Date(item.date) : item.date;
        return isWithinInterval(itemDate, {
          start: dateRange.from as Date,
          end: dateRange.to as Date,
        });
      });
    };

    return {
      incomes: filterByDate(allData.incomes || []),
      costs: filterByDate(allData.costs || []),
      expenses: filterByDate(allData.expenses || []),
    };
  }, [allData, dateRange]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [incomesRes, costsRes, expensesRes] = await Promise.all([
          !selectedUser
            ? getAdminIncomes()
            : getIncomesByUserId(selectedUser.id || ""),
          !selectedUser
            ? getAdminCosts()
            : getCostsByUserId(selectedUser.id || ""),
          !selectedUser
            ? getAdminExpenses()
            : getExpensesByUserId(selectedUser.id || ""),
        ]);

        setAllData({
          incomes: incomesRes.success
            ? (incomesRes.data || []).map((item) => ({
                ...item,
                date: new Date(item.date),
              }))
            : [],
          costs: costsRes.success
            ? (costsRes.data || []).map((item) => ({
                ...item,
                date: new Date(item.date),
              }))
            : [],
          expenses: expensesRes.success
            ? (expensesRes.data || []).map((item) => ({
                ...item,
                date: new Date(item.date),
              }))
            : [],
        });

        // Simular datos del período anterior para la tendencia
        setPreviousPeriodData({
          ingresos: incomesRes.success
            ? (incomesRes.data?.[0]?.total || 0) * 0.85
            : 0,
          costos: costsRes.success ? (costsRes.data?.[0]?.total || 0) * 0.9 : 0,
          gastos: expensesRes.success
            ? (expensesRes.data?.[0]?.amount || 0) * 0.95
            : 0,
        });
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error al cargar datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedUser, dateRange]);

  // Calcular métricas con datos filtrados
  const { totalIncomes, totalCosts, totalExpenses, balance, trend } =
    useMemo(() => {
      const incomes = (filteredData.incomes || []).reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      const costs = (filteredData.costs || []).reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      const expenses = (filteredData.expenses || []).reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );
      const currentBalance = incomes - (costs + expenses);

      // Calcular tendencia
      let trendValue = "Estable";
      let trendPositive = true;
      if (previousPeriodData) {
        const incomeChange = incomes - previousPeriodData.ingresos;
        // const costChange = costs - previousPeriodData.costos;
        // const expenseChange = expenses - previousPeriodData.gastos;

        if (Math.abs(incomeChange) > 0) {
          trendValue = incomeChange > 0 ? "En crecimiento" : "En descenso";
          trendPositive = incomeChange > 0;
        }
      }

      return {
        totalIncomes: incomes,
        totalCosts: costs,
        totalExpenses: expenses,
        balance: currentBalance,
        trend: {
          value: trendValue,
          positive: trendPositive,
          description: previousPeriodData
            ? "Comparado con el período anterior"
            : "Datos iniciales",
        },
      };
    }, [filteredData, previousPeriodData]);

  // Preparar datos para gráficos
  const monthlyData = useMemo(() => {
    if (!filteredData.incomes.length) return [];

    // Agrupar por mes
    const grouped = filteredData.incomes.reduce((acc, item) => {
      const month = format(new Date(item.date), "MMM yyyy", { locale: es });
      if (!acc[month]) {
        acc[month] = {
          fecha: month,
          ingresos: 0,
          costos: 0,
          gastos: 0,
        };
      }
      acc[month].ingresos += item.total || 0;
      return acc;
    }, {} as Record<string, FinancialData>);

    // Agregar costos y gastos
    filteredData.costs.forEach((item) => {
      const month = format(new Date(item.date), "MMM yyyy", { locale: es });
      if (grouped[month]) {
        grouped[month].costos += item.total || 0;
      }
    });

    filteredData.expenses.forEach((item) => {
      const month = format(new Date(item.date), "MMM yyyy", { locale: es });
      if (grouped[month]) {
        grouped[month].gastos += item.amount || 0;
      }
    });

    return Object.values(grouped);
  }, [filteredData]);

  const CashFlowTable = ({
    incomes = [],
    costs = [],
    expenses = [],
  }: {
    incomes?: IncomeItem[];
    costs?: CostItem[];
    expenses?: ExpenseItem[];
  }) => {
    const cashFlowData: CashFlowItem[] = useMemo(() => {
      return [
        ...incomes.map((item) => ({
          date: new Date(item.date),
          type: "Ingreso",
          concept: item.concept || "Sin concepto",
          amount: item.total || 0,
          category: "Ingreso",
        })),
        ...costs.map((item) => ({
          date: new Date(item.date),
          type: "Costo",
          concept: item.concept || "Sin concepto",
          amount: -(item.total || 0),
          category: "Costo",
        })),
        ...expenses.map((item) => ({
          date: new Date(item.date),
          type: "Gasto",
          concept: item.concept || "Sin concepto",
          amount: -(item.amount || 0),
          category: item.category || "Sin categoría",
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [incomes, costs, expenses]);

    const columns: ColumnDef<CashFlowItem>[] = [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue("date") as Date;
          return format(date, "dd/MM/yyyy", { locale: es });
        },
      },
      {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <Badge variant={type === "Ingreso" ? "default" : "destructive"}>
              {type}
            </Badge>
          );
        },
      },
      {
        accessorKey: "concept",
        header: "Concepto",
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Monto
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("amount"));
          return (
            <span className={amount >= 0 ? "text-green-500" : "text-red-500"}>
              {amount >= 0 ? "+" : ""}
              {amount.toFixed(2)}
            </span>
          );
        },
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={cashFlowData}
        searchKey="concept"
        searchPlaceholder="Buscar por concepto..."
      />
    );
  };

  const UserCombobox = () => {
    return (
      <Popover open={userComboboxOpen} onOpenChange={setUserComboboxOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={userComboboxOpen}
            className="w-full justify-between"
          >
            {selectedUser
              ? selectedUser.name || selectedUser.email
              : "Todos los usuarios"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar usuario..." className="h-9" />
            <CommandList>
              <CommandEmpty>No se encontraron usuarios</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    setSelectedUser(null);
                    setUserComboboxOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !selectedUser ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Todos los usuarios
                </CommandItem>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.name || user.email || ""}
                    onSelect={() => {
                      setSelectedUser(user);
                      setUserComboboxOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedUser?.id === user.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {user.name || user.email}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const renderEmptyState = (type: string) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground">
        {selectedUser
          ? `No hay ${type} registrados`
          : "No se ha seleccionado ningún usuario"}
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        {selectedUser
          ? `Aún no se han registrado ${type} para este usuario.`
          : "Selecciona un usuario para ver su información financiera"}
      </p>
    </div>
  );

  const renderMetricCard = (
    title: string,
    value: number,
    icon: React.ReactNode,
    positive: boolean,
    description?: string
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${value.toLocaleString("es-ES")}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Reportes Avanzados</CardTitle>
            <ExportDataButton
              exportAll={!selectedUser}
              userId={selectedUser?.id}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-1">
              <DatePickerWithRange
                dateRange={dateRange}
                onDateRangeChange={(range) => range && setDateRange(range)}
              />
            </div>

            <div className="lg:col-span-1">
              <UserCombobox />
            </div>

            <div className="lg:col-span-2 flex items-center">
              <div className="text-sm text-muted-foreground">
                {selectedUser
                  ? `Visualizando datos de ${
                      selectedUser.name || selectedUser.email
                    }`
                  : "Visualizando datos de todos los usuarios"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ReportType)}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="incomes">Ingresos</TabsTrigger>
            <TabsTrigger value="costs">Costos</TabsTrigger>
            <TabsTrigger value="expenses">Gastos</TabsTrigger>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Reportes Avanzados</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("cashflow")}>
                  Flujo de Caja
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("results")}>
                  Estado de Resultados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsList>
        </div>

        <TabsContent value="summary">
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={`metric-skeleton-${i}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-full mb-1" />
                      <Skeleton className="h-3 w-[120px]" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={`chart-skeleton-${i}`}>
                    <CardHeader>
                      <Skeleton className="h-6 w-[180px]" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[250px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {renderMetricCard(
                  "Ingresos",
                  totalIncomes,
                  trend.positive ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ),
                  trend.positive,
                  trend.value
                )}
                {renderMetricCard(
                  "Costos",
                  totalCosts,
                  <PieChart className="h-4 w-4" />,
                  false
                )}
                {renderMetricCard(
                  "Gastos",
                  totalExpenses,
                  <PieChart className="h-4 w-4" />,
                  false
                )}
                {renderMetricCard(
                  "Balance",
                  balance,
                  balance >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ),
                  balance >= 0,
                  balance >= 0 ? "Positivo" : "Negativo"
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChartCard
                  title="Distribución Mensual"
                  description="Evolución de ingresos, costos y gastos por mes"
                  data={monthlyData}
                  config={{
                    ingresos: {
                      label: "Ingresos",
                      color: "hsl(var(--primary))",
                    },
                    costos: {
                      label: "Costos",
                      color: "hsl(var(--destructive))",
                    },
                    gastos: {
                      label: "Gastos",
                      color: "hsl(var(--warning))",
                    },
                  }}
                  aspectRatio={16 / 7}
                />

                <PieChartCard
                  data={[
                    { name: "Ingresos", value: totalIncomes },
                    { name: "Costos", value: totalCosts },
                    { name: "Gastos", value: totalExpenses },
                  ]}
                  title="Composición Financiera"
                  description="Proporción de ingresos, costos y gastos"
                  trend={{
                    value: `Balance: $${balance.toLocaleString("es-ES")}`,
                    description:
                      balance >= 0
                        ? "Resultado positivo"
                        : "Resultado negativo",
                    positive: balance >= 0,
                  }}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="incomes">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser
                  ? `Ingresos de ${selectedUser.name || selectedUser.email}`
                  : "Ingresos"}
              </CardTitle>
              <CardDescription>
                {selectedUser
                  ? "Historial de ingresos del usuario seleccionado"
                  : "Todos los ingresos registrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[400px] w-full" />
                </div>
              ) : filteredData.incomes.length > 0 ? (
                <div className="space-y-6">
                  <BarChartCard
                    title="Distribución Mensual de Ingresos"
                    description="Evolución de ingresos por mes"
                    data={monthlyData.map((item) => ({
                      ...item,
                      costos: 0,
                      gastos: 0,
                    }))}
                    config={{
                      ingresos: {
                        label: "Ingresos",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    aspectRatio={16 / 6}
                  />
                  <IncomeTable incomes={filteredData.incomes} />
                </div>
              ) : (
                renderEmptyState("ingresos")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser
                  ? `Costos de ${selectedUser.name || selectedUser.email}`
                  : "Costos"}
              </CardTitle>
              <CardDescription>
                {selectedUser
                  ? "Historial de costos del usuario seleccionado"
                  : "Todos los costos registrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[400px] w-full" />
                </div>
              ) : filteredData.costs.length > 0 ? (
                <div className="space-y-6">
                  <BarChartCard
                    title="Distribución Mensual de Costos"
                    description="Evolución de costos por mes"
                    data={monthlyData.map((item) => ({
                      ...item,
                      ingresos: 0,
                      gastos: 0,
                    }))}
                    config={{
                      costos: {
                        label: "Costos",
                        color: "hsl(var(--destructive))",
                      },
                    }}
                    aspectRatio={16 / 6}
                  />
                  <CostsTable costs={filteredData.costs} />
                </div>
              ) : (
                renderEmptyState("costos")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser
                  ? `Gastos de ${selectedUser.name || selectedUser.email}`
                  : "Gastos"}
              </CardTitle>
              <CardDescription>
                {selectedUser
                  ? "Historial de gastos del usuario seleccionado"
                  : "Todos los gastos registrados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[400px] w-full" />
                </div>
              ) : filteredData.expenses.length > 0 ? (
                <div className="space-y-6">
                  <BarChartCard
                    title="Distribución Mensual de Gastos"
                    description="Evolución de gastos por mes"
                    data={monthlyData.map((item) => ({
                      ...item,
                      ingresos: 0,
                      costos: 0,
                    }))}
                    config={{
                      gastos: {
                        label: "Gastos",
                        color: "hsl(var(--warning))",
                      },
                    }}
                    aspectRatio={16 / 6}
                  />
                  <ExpencesTable expenses={filteredData.expenses} />
                </div>
              ) : (
                renderEmptyState("gastos")
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser
                  ? `Flujo de caja de ${
                      selectedUser.name || selectedUser.email
                    }`
                  : "Flujo de caja"}
              </CardTitle>
              <CardDescription>
                {selectedUser
                  ? "Movimientos financieros del usuario seleccionado"
                  : "Todos los movimientos financieros"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[400px] w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <BarChartCard
                    title="Flujo Mensual"
                    description="Entradas y salidas por mes"
                    data={monthlyData}
                    config={{
                      ingresos: {
                        label: "Ingresos",
                        color: "hsl(var(--primary))",
                      },
                      costos: {
                        label: "Costos",
                        color: "hsl(var(--destructive))",
                      },
                      gastos: {
                        label: "Gastos",
                        color: "hsl(var(--warning))",
                      },
                    }}
                    aspectRatio={16 / 6}
                  />
                  <CashFlowTable
                    incomes={filteredData.incomes}
                    costs={filteredData.costs}
                    expenses={filteredData.expenses}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser
                  ? `Estado de resultados de ${
                      selectedUser.name || selectedUser.email
                    }`
                  : "Estado de resultados"}
              </CardTitle>
              <CardDescription>
                Resumen financiero del período seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[400px] w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderMetricCard(
                      "Ingresos Totales",
                      totalIncomes,
                      <TrendingUp className="h-4 w-4 text-green-500" />,
                      true,
                      trend.value
                    )}
                    {renderMetricCard(
                      "Costos y Gastos",
                      totalCosts + totalExpenses,
                      <TrendingDown className="h-4 w-4 text-red-500" />,
                      false,
                      "Todos los egresos"
                    )}
                    {renderMetricCard(
                      "Resultado Final",
                      balance,
                      balance >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ),
                      balance >= 0,
                      balance >= 0 ? "Beneficio" : "Pérdida"
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PieChartCard
                      data={[
                        { name: "Ingresos", value: totalIncomes },
                        { name: "Costos", value: totalCosts },
                        { name: "Gastos", value: totalExpenses },
                      ]}
                      title="Composición Financiera"
                      description="Proporción de ingresos, costos y gastos"
                      trend={{
                        value: `Balance: $${balance.toLocaleString("es-ES")}`,
                        description:
                          balance >= 0
                            ? "Resultado positivo"
                            : "Resultado negativo",
                        positive: balance >= 0,
                      }}
                    />

                    <BarChartCard
                      title="Evolución Trimestral"
                      description="Comparativa de los últimos trimestres"
                      data={monthlyData.slice(-3)}
                      config={{
                        ingresos: {
                          label: "Ingresos",
                          color: "hsl(var(--primary))",
                        },
                        costos: {
                          label: "Costos",
                          color: "hsl(var(--destructive))",
                        },
                        gastos: {
                          label: "Gastos",
                          color: "hsl(var(--warning))",
                        },
                      }}
                      aspectRatio={16 / 6}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
