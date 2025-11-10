"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { TrendingUp, Package } from "lucide-react";
import { Pie, PieChart, Cell, Legend } from "recharts";
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

interface FoodDonationsChartProps {
  RaUsuario?: number;
}

interface ItemAlimento {
  Quantidade: number;
  PesoUnidade: number;
  PontuacaoAlimento: number;
  NomeAlimento: string;
}

interface ContributionData {
  RaUsuario: number;
  TipoDoacao: string;
  Quantidade: number;
  DataContribuicao: string;
  Itens?: ItemAlimento[];
  alimentos?: {
    NomeAlimento: string;
    Pontuacao?: number | string;
  }[];
  contribuicoes_alimento?: any[];
}

interface FoodChartData {
  name: string;
  value: number;
  quantidade: number;
  fill: string;
}

const generateColor = (index: number): string => {
  const colors = [
    "#254128",
    "#cd6184",
    "#195b41",
    "#a7b96e",
    "#fffefb",
    "#fad8db",
  ];
  return colors[index % colors.length];
};

const processAlimentos = (
  contributions: ContributionData[]
): FoodChartData[] => {
  const alimentosMap = new Map<string, { quantidade: number; count: number }>();

  contributions.forEach((contribution) => {
    let alimentos: { NomeAlimento: string; Quantidade?: number }[] = [];

    if (Array.isArray(contribution.contribuicoes_alimento)) {
      alimentos = contribution.contribuicoes_alimento
        .filter((item: any) => item.alimento?.NomeAlimento?.trim())
        .map((item: any) => ({
          NomeAlimento: item.alimento.NomeAlimento,
          Quantidade: contribution.Quantidade || 1,
        }));
    } else if (Array.isArray(contribution.alimentos)) {
      alimentos = contribution.alimentos
        .filter((item) => item.NomeAlimento?.trim())
        .map((item) => ({
          NomeAlimento: item.NomeAlimento,
          Quantidade: contribution.Quantidade || 1,
        }));
    } else if (Array.isArray(contribution.Itens)) {
      alimentos = contribution.Itens.filter((item) =>
        item.NomeAlimento?.trim()
      ).map((item) => ({
        NomeAlimento: item.NomeAlimento,
        Quantidade: item.Quantidade || 1,
      }));
    }

    alimentos.forEach((alimento) => {
      const nome = alimento.NomeAlimento.trim();
      const qtd = Number(alimento.Quantidade);

      const existing = alimentosMap.get(nome) || { quantidade: 0, count: 0 };
      alimentosMap.set(nome, {
        quantidade: existing.quantidade + qtd,
        count: existing.count + 1,
      });
    });
  });

  return Array.from(alimentosMap.entries())
    .map(([name, data], index) => ({
      name,
      value: data.count,
      quantidade: data.quantidade,
      fill: generateColor(index),
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
};

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

const chartConfig = {
  quantidade: {
    label: "Quantidade Total",
  },
  value: {
    label: "Doações",
  },
} satisfies ChartConfig;

export function FoodDonationsChart({ RaUsuario }: FoodDonationsChartProps) {
  const [contributions, setContributions] = useState<ContributionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContributions = useCallback(
    async (signal: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = RaUsuario
          ? `${backend_url}/api/contributions/${RaUsuario}`
          : `${backend_url}/api/contributions`;

        const response = await fetch(endpoint, {
          cache: "no-store",
          signal,
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar contribuições: ${response.status}`);
        }

        const rawData = await response.json();
        const data = Array.isArray(rawData) ? rawData : [];

        setContributions(data);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("Erro ao buscar contribuições:", err);
          setError(err?.message ?? "Erro inesperado ao carregar dados");
        }
      } finally {
        setLoading(false);
      }
    },
    [RaUsuario]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchContributions(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchContributions]);

  const chartData = useMemo(() => {
    if (contributions.length === 0) return [];
    return processAlimentos(contributions);
  }, [contributions]);

  const stats = useMemo(() => {
    const totalDoacoes = chartData.reduce((sum, item) => sum + item.value, 0);
    const totalQuantidade = chartData.reduce(
      (sum, item) => sum + item.quantidade,
      0
    );
    const tiposAlimentos = chartData.length;

    return { totalDoacoes, totalQuantidade, tiposAlimentos };
  }, [chartData]);

  const renderCustomLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2">
          Doações Alimentícias
        </CardTitle>
        <CardDescription>
          Alimentos mais doados durante o período dessa edição
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <p className="text-red-500 mb-2">⚠️ {error}</p>
              <button
                onClick={() => fetchContributions(new AbortController().signal)}
                className="text-sm text-primary hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Nenhum alimento doado ainda</p>
              <p className="text-sm mt-2">
                As doações aparecerão aqui quando forem registradas
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[350px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, props) => (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold">
                          {props.payload.name}
                        </span>
                        <span className="text-sm">Doações: {value}</span>
                        <span className="text-sm">
                          Quantidade:{" "}
                          {Intl.NumberFormat("pt-BR").format(
                            props.payload.quantidade
                          )}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                label={renderCustomLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm">
                    {value} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>

      {/* {!loading && !error && chartData.length > 0 && (
        <CardFooter className="flex-col gap-3 text-sm border-t pt-4">
          <div className="flex items-center gap-2 font-medium leading-none">
            <TrendingUp className="h-4 w-4" />
            {stats.tiposAlimentos} tipos de alimentos doados
          </div>

          <div className="grid grid-cols-2 gap-4 w-full text-center">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                {stats.totalDoacoes}
              </span>
              <span className="text-xs text-muted-foreground">
                Total de doações
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                {Intl.NumberFormat("pt-BR").format(stats.totalQuantidade)}
              </span>
              <span className="text-xs text-muted-foreground">
                Quantidade total
              </span>
            </div>
          </div>
        </CardFooter>
      )} */}
    </Card>
  );
}

export default FoodDonationsChart;
