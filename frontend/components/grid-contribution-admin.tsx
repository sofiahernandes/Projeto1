"use client";

import React, { useEffect, useState } from "react";
import { HandHeart } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { v4 as uuidv4 } from "uuid";
import { Contribution } from "./contribution-table-admin/columns";
import Loading from "./loading";

interface RenderContributionProps {
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
  isPublicReport?: boolean;
}

type ItemAlimento = {
  Quantidade: number;
  PesoUnidade: number;
  PontuacaoAlimento: number;
  NomeAlimento: string;
};

type ContributionAdmin = Contribution & {
  Itens?: ItemAlimento[];
  PesoTotal?: number;
  PontuacaoTotal?: number;
  alimentos?: {
    NomeAlimento: string;
    Pontuacao?: number | string;
  }[];
};

export default function RenderContributionCardAdmin({
  onSelect,
  refreshKey = 0,
  isPublicReport = false,
}: RenderContributionProps) {
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
              const quantidade = Number(
                String(r.Quantidade).replace(/\./g, "").replace(",", ".")
              );

              const pesoUnidade =
                r.PesoUnidade != null
                  ? Number(
                      String(r.PesoUnidade).replace(/\./g, "").replace(",", ".")
                    )
                  : 0;

              const itens: ItemAlimento[] = Array.isArray(
                r.contribuicoes_alimento
              )
                ? r.contribuicoes_alimento.map(
                    (it: any): ItemAlimento => ({
                      Quantidade: quantidade,
                      PesoUnidade: pesoUnidade,
                      PontuacaoAlimento: Number(it?.alimento?.Pontuacao ?? 0),
                      NomeAlimento: String(it?.alimento?.NomeAlimento ?? ""),
                    })
                  )
                : [];

              const pesoTotal =
                Number.isFinite(quantidade) && Number.isFinite(pesoUnidade)
                  ? quantidade * pesoUnidade
                  : undefined;

              const pontTotal = itens.reduce<number>((sum, it) => {
                const parc = it.Quantidade * it.PontuacaoAlimento;
                return sum + (Number.isFinite(parc) ? parc : 0);
              }, 0);

              console.log("Calculado:", {
                quantidade,
                pesoUnidade,
                pesoTotal,
                pontTotal,
                itens,
              });

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
                                Quantidade: quantidade,
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
                                NomeTime: r.NomeTime ?? undefined,
                                Itens: itens,
                                PesoTotal: pesoTotal,
                                PontuacaoTotal: itens.length ? pontTotal : undefined,
                                PontuacaoAlimento: r.PontuacaoAlimento ?? undefined,
                                PesoUnidade: pesoUnidade,
                                uuid: uuidv4(),
                

               alimentos: Array.isArray(r.contribuicoes_alimento)
                  ? r.contribuicoes_alimento
                      .filter(
                        (a: any) => a.alimento?.NomeAlimento?.trim() !== ""
                      )
                      .map((a: any) => ({
                        NomeAlimento: a.alimento?.NomeAlimento ?? "",
                        Pontuacao: a.alimento?.Pontuacao ?? "",
                      }))
                  : [],
              };
            })
          : [];
        console.log(raw);
        setContributions(data);
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
  }, [refreshKey]);

  if (contributions.length === 0) {
    return (
      <div className="col-start-2 border rounded-xl border-gray-200 shadow-xl w-auto max-w-100 mx-auto">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HandHeart size={44} strokeWidth={1.2} />
            </EmptyMedia>
            <EmptyTitle>Nenhuma contribuição por enquanto!</EmptyTitle>
            <EmptyDescription>
              Nessa edição, nenhum grupo arrecadou doações. Quando os alunos
              líderes adicionarem ao Arkana, aparecerá aqui!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="w-screen h-full text-center text-gray-600">
          <Loading />
        </div>
      )}

      {!loading && isPublicReport ? (
        <div className="md:mx-4 mb-15 grid grid-cols-1 md:grid-cols-3 gap-4.5 rounded-sm md:p-2.5">
          {contributions.map((c) => (
            <div
              key={c.uuid}
              className="p-3 rounded-xl hover:bg-secondary/5 hover:text-secondary border border-gray-200 shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => onSelect?.(c)}
            >
              <p className="font-semibold text-lg ">{c.NomeTime}</p>
              <p className="text-base text-gray-950">
                Data: {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-base text-gray-950">
                Fonte da doação: {c.Fonte}
              </p>
              <p className="text-base text-gray-950">
                Ra do Aluno: {c.RaUsuario}
              </p>
              <p className="text-base text-gray-800">
                Tipo de Doação: {c.TipoDoacao}
              </p>
              <p className="text-base text-gray-800">
                Quantidade: {Intl.NumberFormat("pt-BR").format(c.Quantidade)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-4 mb-15 grid grid-cols-1 md:grid-cols-3 gap-4.5 rounded-sm p-2.5">
          {contributions.map((c) => (
            <div
              key={c.uuid}
              className="p-3 rounded-xl hover:bg-[#cc3983]/15 border border-gray-200 shadow-md  hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              onClick={() => onSelect?.(c)}
            >
              <p className="font-semibold text-lg ">{c.NomeTime}</p>
              <p className="text-base text-gray-950">
                Data: {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-base text-gray-950">
                Fonte da doação: {c.Fonte}
              </p>
              <p className="text-base text-gray-950">
                Ra do Aluno: {c.RaUsuario}
              </p>
              <p className="text-base text-gray-800">
                Tipo de Doação: {c.TipoDoacao}
              </p>
              <p className="text-base text-gray-800">
                Quantidade: {Intl.NumberFormat("pt-BR").format(c.Quantidade)}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
