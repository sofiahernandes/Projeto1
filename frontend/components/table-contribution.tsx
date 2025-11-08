"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { HandHeart as HandHeart } from "lucide-react";
import { DataTable } from "@/components/contribution-table/data-table";
import {
  makeContributionColumns,
  type Contribution,
} from "@/components/contribution-table/columns";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface RenderContributionProps {
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
}

export default function RenderContributionTable({
  onSelect,
  refreshKey = 0,
}: RenderContributionProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const RaUsuario = Number(params.RaUsuario);

  const columns = useMemo(
    () =>
      makeContributionColumns({
        onView: (c) => onSelect?.(c),
      }),
    [onSelect]
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${backend_url}/api/contributions/${RaUsuario}`,
          { cache: "no-store", signal: controller.signal }
        );

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
              comprovante:
                r.IdComprovante && r.Imagem
                  ? {
                      IdComprovante: Number(r.IdComprovante),
                      Imagem: String(r.Imagem),
                    }
                  : undefined,
              IdContribuicao: Number(r.IdContribuicao),
              DataContribuicao: String(r.DataContribuicao ?? ""),
              NomeAlimento: r.NomeAlimento ?? undefined,
              PontuacaoAlimento: r.PontuacaoAlimento ?? undefined,
              PesoUnidade: r.PesoUnidade ?? undefined,
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
  }, [RaUsuario, refreshKey]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse text-sm text-muted-foreground">
          Carregando contribuições…
        </div>
      </div>
    );
  }
  if (!contributions.length) {
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
          <EmptyContent />
        </Empty>
      </div>
    );
  }

  return (
    <div className="p-2.5">
      <DataTable<Contribution, unknown>
        columns={columns}
        data={contributions}
      />
    </div>
  );
}
``;
