"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
// Se sua versão do lucide-react não tem BoxIcon, use Box:
import { Box as BoxIcon } from "lucide-react";

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

/* Coisas pra mudar: coluna Meta não deixar tudo com R$ por causa dos kg de alimento
input de procurar fonte da doação
estilo da tabela
*/


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
  const userId = Number(params.userId);

  const columns = useMemo(
    () =>
      makeContributionColumns({
        onView: (c) => onSelect?.(c)
      }),
    [onSelect]
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `http://localhost:3001/api/contributions/${userId}`,
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
              Comprovante: r.Comprovante ?? undefined,
              IdContribuicao: Number(r.IdContribuicao),
              DataContribuicao: String(r.DataContribuicao ?? ""),
            }))
          : [];

        setContributions(data);
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
        console.error(err);
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
  }, [userId, refreshKey]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse text-sm text-muted-foreground">
          Carregando contribuições…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-sm text-red-600">Erro: {error}</div>
      </div>
    );
  }

  if (!contributions.length) {
    return (
      <div className="col-start-2 border rounded-xl border-gray-200 shadow-xl w-auto max-w-100 mx-auto">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BoxIcon />
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
      <DataTable columns={columns} data={contributions} />
    </div>
  );
}
``