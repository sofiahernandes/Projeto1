"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function RenderContribution({
  onSelect,
  refreshKey = 0
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
    return <p className="text-gray-800">Nenhuma contribuição encontrada!</p>;
  }

  return (
    <>
      {contributions.map((c) => (
        <div
          key={c.IdContribuicao}
          className="p-3 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/15 border border-gray-200 shadow-md  hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          onClick={() => onSelect?.(c)}
        >
          <p className="font-semibold text-lg ">{c.Fonte}</p>
          <p className="text-sm text-gray-950">
            Data: {new Date(c.DataContribuicao).toLocaleDateString()}
          </p>
          <p className="text-base text-gray-800">Tipo de Doação: {c.TipoDoacao}</p>
          <p className="text-base text-gray-800">Quantidade: R$/kg {c.Quantidade}</p>
          <p className="text-base text-gray-800">Gastos: R${c.Gastos}</p>
        </div>
      ))}
    </>
  );
}
