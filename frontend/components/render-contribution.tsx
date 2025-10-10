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
  onSelect?: (contribution: Contribution) => void
}

export default function RenderContribution({ onSelect }: RenderContributionProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const params = useParams();
  const userId = Number(params.userId);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch(`http://localhost:3001/api/contributions/${userId}`);

        if (!res.ok) throw new Error("Erro ao buscar contribuições");
        const data = await res.json();

        setContributions(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchContributions();
  }, [userId]);

  if (contributions.length === 0) {
    return <p className="text-gray-800">Nenhuma contribuição encontrada!</p>;
  }

  return (
    <>
      {contributions.map((c) => (
        <div
          key={c.IdContribuicao}
          className="  p-4 rounded flex flex-col gap-1 
             cursor-pointer hover:bg-[#cd6184]/15 border border-[#cd6184]/40 shadow-xl"
          onClick={() => onSelect?.(c)}
        >
          <div className="font-semibold text-lg">{c.Fonte}</div>
          <div className="text-gray-500 text-sm">
            Data: {new Date(c.DataContribuicao).toLocaleDateString()}
          </div>
          <div>Tipo de Doação: {c.TipoDoacao}</div>
          <div>Quantidade: R$/kg {c.Quantidade}</div>
          <div>Gastos: R${c.Gastos}</div> 
        </div>

        
      ))}
    </>
  );
}
