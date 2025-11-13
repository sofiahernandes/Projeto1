"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import Hero from "@/components/hero";
import Footer from "@/components/footer";

import { overallMetrics } from "@/lib/overall-metrics";
import { useEffect, useState } from "react";
import { Contribution } from "@/components/contribution-table-admin/columns";

export default function PublicDashboard() {
  const [biggestMoneyDonations, setBiggestMoneyDonations] = useState<
    Contribution[]
  >([]);
  const [biggestFoodDonations, setBiggestFoodDonations] = useState<
    Contribution[]
  >([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    let active = true;

    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${backend_url}/api/contributions`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Erro ao buscar contribuições");
        const raw = await res.json();
        if (!active) return;

        const data: Contribution[] = Array.isArray(raw)
          ? raw.map((r: any) => {
              const IdContribuicao = Number(
                r.IdContribuicao ??
                  r.IdContribuicaoFinanceira ??
                  r.IdContribuicaoAlimenticia
              );

              const idComp =
                r?.comprovante?.IdComprovante ?? r?.IdComprovante ?? null;

              const rawImg =
                r?.Comprovante ??
                r?.comprovante?.Imagem ??
                r?.Comprovante?.Imagem ??
                r?.Imagem ??
                r?.comprovantes?.[0]?.Imagem ??
                r?.UrlComprovante ??
                null;

              let comprovante:
                | { IdComprovante: number; Imagem: string }
                | undefined;

              if (rawImg && String(rawImg).trim() !== "") {
                const s = String(rawImg).trim();
                const isAbsolute = /^https?:\/\//i.test(s);
                const base = (
                  process.env.NEXT_PUBLIC_BACKEND_URL || ""
                ).replace(/\/$/, "");
                const finalUrl = isAbsolute
                  ? s
                  : `${base}/uploads/${s.replace(/^\/+/, "")}`;

                comprovante = {
                  IdComprovante: idComp != null ? Number(idComp) : 0,
                  Imagem: finalUrl,
                };
              }

              return {
                RaUsuario: Number(r.RaUsuario),
                TipoDoacao: String(r.TipoDoacao ?? ""),
                Quantidade:
                  r.Quantidade != null
                    ? Number(
                        String(r.Quantidade)
                          .replace(/\./g, "")
                          .replace(",", ".")
                      )
                    : 0,
                Meta:
                  r.Meta != null
                    ? Number(
                        String(r.Meta).replace(/\./g, "").replace(",", ".")
                      )
                    : undefined,
                Gastos:
                  r.Gastos != null
                    ? Number(
                        String(r.Gastos).replace(/\./g, "").replace(",", ".")
                      )
                    : undefined,
                Fonte: r.Fonte ?? "",
                comprovante,
                IdContribuicao,
                DataContribuicao: String(r.DataContribuicao ?? ""),
                NomeAlimento: r.NomeAlimento ?? undefined,
                PontuacaoAlimento: r.PontuacaoAlimento ?? undefined,
                NomeTime: r.NomeTime ?? undefined,
                PesoUnidade: r.PesoUnidade ?? undefined,
                uuid: uuidv4(),
              };
            })
          : [];
        setContributions(data);

        contributions.map((contribution) => {
          if (contribution.TipoDoacao === "Financeira") {
            setBiggestMoneyDonations((prev) => {
              const updated = [...prev, contribution];
              return updated
                .sort((a, b) => b.Quantidade - a.Quantidade)
                .slice(0, 10);
            });
          } else if (contribution.TipoDoacao === "Alimenticia") {
            setBiggestFoodDonations((prev) => {
              const updated = [...prev, contribution];
              return updated
                .sort(
                  (a, b) =>
                    b.Quantidade * b.PesoUnidade - a.Quantidade * a.PesoUnidade
                )
                .slice(0, 10);
            });
          }
        });
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
        setError(err?.message ?? "Erro inesperado");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchContributions();

    return () => {
      active = false;
      controller.abort();
    };
  }, [contributions.length]);

  return (
    <div className="flex flex-col">
      <Hero />

      <main
        id="public-graph"
        className="w-full lg:p-10 p-6 flex align-center justify-center"
      >
        <div className="w-full">
          <div className="flex justify-center w-full pb-4">
            <h1 className="font-light text-white text-sm">Arkana Dashboard</h1>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {overallMetrics.map((metric, index) => (
                <Card
                  key={index}
                  className="h-22 justify-center bg-primary border-none shadow-sm overflow-hidden"
                >
                  <CardContent className="px-6">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <metric.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm">{metric.label}</p>
                        <p className="text-2xl font-semibold">{metric.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="hover:border-secondary/50 bg-transparent border border-secondary/40">
                <CardContent className="px-6">
                  <h2 className="text-lg text-center font-semibold text-gray-900 pb-3">
                    Maiores Doações Financeiras
                  </h2>
                  <div>
                    {biggestMoneyDonations.length > 0 ? (
                      biggestMoneyDonations.slice(0, 6).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/20 cursor-pointer transition-colors"
                        >
                          <p className="text-gray-900">
                            {item.Fonte ?? "Fonte desconhecida"}
                          </p>
                          <span className="text-secondary">
                            R$ {item.Quantidade}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="mx-auto text-center text-gray-700">
                        Nenhuma doação financeira encontrada.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:border-secondary/50 bg-transparent border border-secondary/40">
                <CardContent className="px-6">
                  <h2 className="text-lg text-center font-semibold text-gray-900 pb-3">
                    Maiores Doações Alimentícias
                  </h2>
                  <div>
                    {biggestFoodDonations.length > 0 ? (
                      biggestFoodDonations.slice(0, 6).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/20 cursor-pointer transition-colors"
                        >
                          <p className="text-gray-900">
                            {item.Fonte ?? "Fonte desconhecida"}
                          </p>
                          <span className="text-secondary"> {item.Quantidade * item.PesoUnidade} kg
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="mx-auto text-center text-gray-700">
                        Nenhuma doação alimentícia encontrada.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="px-0">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="overflow-hidden h-18 flex-col gap-2 bg-secondary/40 hover:bg-secondary/50 hover:border-secondary/60 border border-secondary/40 transition-colors">
                    <Link
                      href="/register/login"
                      className="flex flex-col gap-2 items-center"
                    >
                      <BookOpen className="w-6 h-6 text-gray-600" />
                      <span className="text-sm text-gray-900 font-medium">
                        Registrar Doações
                      </span>
                    </Link>
                  </Button>
                  <Button className="bg-secondary/40 overflow-hidden h-18 gap-2 hover:bg-secondary/50 border border-secondary/40">
                    <Link
                      href="/public-reports"
                      className="flex flex-col gap-2 items-center"
                    >
                      <FileText className="w-6 h-6 text-gray-600" />
                      <span className="text-sm text-gray-900 font-medium">
                        Ver Relatórios
                      </span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
