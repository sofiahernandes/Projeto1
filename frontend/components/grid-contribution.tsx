"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BoxIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import formatBRL from "./formatBRL";


interface Contribution {
  RaUsuario: number;
  TipoDoacao: string;
  Quantidade: number;
  Meta?: number;
  Gastos?: number;
  Fonte?: string;
  Comprovante?: string;
  IdContribuicao: number;
  DataContribuicao: string;
}

interface RenderContributionProps {
  onSelect?: (contribution: Contribution) => void;
  refreshKey?: number;
}

export default function RenderContributionCard({
  onSelect,
  refreshKey = 0,
}: RenderContributionProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const userId = Number(params.userId);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchContributions() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:3001/api/contributions/${userId}`,
          { cache: "no-store", signal: controller.signal }
        );

        if (!res.ok) throw new Error("Erro ao buscar contribuições");
        const data = await res.json();

        setContributions(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchContributions();
  }, [userId, refreshKey]);

  if (contributions.length === 0) {
    return (
      <div className="col-start-2 border rounded-xl border-gray-200 shadow-xl w-auto max-w-100 mx-auto"> 
        <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"> 
            {/* mudar o icone  pra maozinha vazia*/}
            <BoxIcon/>
          </EmptyMedia>
          <EmptyTitle>Nenhuma contribuição por enquanto!</EmptyTitle>
          <EmptyDescription>
            Seu grupo ainda não arrecadou nenhuma doação. Quando o aluno líder adicionar ao Arkana, ela aparecerá aqui!
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
          key={c.IdContribuicao}
          className="p-3 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/15 border border-gray-200 shadow-md  hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          onClick={() => onSelect?.(c)}
        >
          <p className="font-semibold text-lg ">{c.Fonte}</p>
          <p className="text-sm text-gray-950">
            Data: {new Date(c.DataContribuicao).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-base text-gray-800">
            Tipo de Doação: {c.TipoDoacao}
          </p>
          <p className="text-base text-gray-800">
            Quantidade: {Intl.NumberFormat("pt-BR").format(c.Quantidade)}
          </p>
          <p className="text-base text-gray-800">Gastos: {formatBRL(c.Gastos)}</p>
        </div>
      ))}
    </div>
  );
}

