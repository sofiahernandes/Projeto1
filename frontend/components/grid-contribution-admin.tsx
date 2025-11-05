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
import { Contribution } from "./contribution-table-admin/columns";

interface RenderContributionProps {
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
}

export default function RenderContributionCardAdmin({
  onSelect,
  refreshKey = 0,
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
          ? raw.map((r: any) => ({
              RaUsuario: Number(r.RaUsuario),
              TipoDoacao: String(r.TipoDoacao ?? ""),
              Quantidade:
                r.Quantidade != null
                  ? Number(
                      String(r.Quantidade).replace(/\./g, "").replace(",", ".")
                    )
                  : 0,
              Meta:
                r.Meta != null
                  ? Number(String(r.Meta).replace(/\./g, "").replace(",", "."))
                  : undefined,
              Gastos:
                r.Gastos != null
                  ? Number(
                      String(r.Gastos).replace(/\./g, "").replace(",", ".")
                    )
                  : undefined,
              Fonte: r.Fonte ?? "",
              Comprovante: r.Comprovante ?? undefined,
              IdContribuicao: Number(r.IdContribuicao),
              DataContribuicao: String(r.DataContribuicao ?? ""),
              NomeAlimento: r.NomeAlimento ?? undefined,
              PontuacaoAlimento: r.PontuacaoAlimento ?? undefined,
              PesoUnidade: r.PesoUnidade ?? undefined,
              NomeTime: r.NomeTime ?? undefined,
              uuid: uuidv4(),
            }))
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
    <div className="mx-4 mb-15 grid grid-cols-1 md:grid-cols-3 gap-4.5 rounded-sm p-2.5">
      {contributions.map((c) => (
        <div
          key={c.uuid}
          className="p-3 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/15 border border-gray-200 shadow-md  hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          onClick={() => onSelect?.(c)}
        >
          <p className="font-semibold text-lg ">{c.NomeTime}</p>
          <p className="text-sm text-gray-950">
            Data: {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-base text-gray-950">Fonte da doação: {c.Fonte}</p>
          <p className="text-base text-gray-950">Ra do Aluno: {c.RaUsuario}</p>
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
