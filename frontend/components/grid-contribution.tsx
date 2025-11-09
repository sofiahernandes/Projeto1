"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HandHeart } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import formatBRL from "./formatBRL";
import { v4 as uuidv4 } from "uuid";
import { Contribution } from "./contribution-table/columns";

interface RenderContributionProps {
  raUsuario?: number,
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
}
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RenderContributionCard({
  raUsuario,
  onSelect,
  refreshKey = 0,
}: RenderContributionProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const params = useParams();
  const raFromParams = params?.RaUsuario ? Number(params.RaUsuario) : undefined;
  const RaUsuario =
    typeof raUsuario === "number" && Number.isFinite(raUsuario)
      ? raUsuario
      : typeof raFromParams === "number" && Number.isFinite(raFromParams)
      ? raFromParams
      : undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${backend_url}/api/contributions/${RaUsuario}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

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
                r?.comprovante?.Imagem ??
                r?.Imagem ??
                r?.UrlComprovante ??
                null;

              let comprovante:
                | { IdComprovante: number; Imagem: string }
                | undefined;

              if (idComp && rawImg && String(rawImg).trim() !== "") {
                const s = String(rawImg).trim();
                const isAbsolute = /^https?:\/\//i.test(s);
                const base = (
                  process.env.NEXT_PUBLIC_BACKEND_URL || ""
                ).replace(/\/$/, "");
                const finalUrl = isAbsolute
                  ? s
                  : `${base}/uploads/${s.replace(/^\/+/, "")}`;

                comprovante = {
                  IdComprovante: Number(idComp),
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
                PesoUnidade: r.PesoUnidade ?? undefined,
                uuid: uuidv4(),
              };
            })
          : [];
        console.log(
          raw,
          data.find((d) => d.comprovante)
        );
        console.log(
          "Comprovantes mapeados:",
          data.map((d) => ({
            id: d.IdContribuicao,
            href: d.comprovante?.Imagem,
          }))
        );
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
  }, [RaUsuario, refreshKey]);

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
              Seu grupo ainda não arrecadou nenhuma doação. Quando o aluno líder
              adicionar ao Arkana, ela aparecerá aqui!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-15 grid grid-cols-1 md:grid-cols-3 gap-4.5 rounded-sm p-2.5">
      {contributions.map((c) => (
        <div
          key={c.uuid}
          className="p-3 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/15 border border-gray-200 shadow-md  hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          onClick={() => onSelect?.(c)}
        >
          <p className="font-semibold text-lg ">{c.Fonte}</p>
          <p className="text-base text-gray-950">
            Data: {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-base text-gray-800">
            Tipo de Doação: {c.TipoDoacao}
          </p>
          <p className="text-base text-gray-800">
            Quantidade: {Intl.NumberFormat("pt-BR").format(c.Quantidade)}
          </p>
          <p className="text-base text-gray-800">
            Gastos: {formatBRL(c.Gastos)}
          </p>
        </div>
      ))}
    </div>
  );
}
