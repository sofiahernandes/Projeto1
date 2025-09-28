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

export default function RenderContribution() {
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const params = useParams();
    const userId = Number(params.userId);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch("http://localhost:3001/api/contributions"); 

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
          className="bg-white p-4 rounded shadow-md flex flex-col gap-1"
        >
          <div className="font-semibold text-lg">Usuário: {c.RaUsuario}</div>
          <div>Tipo de Doação: {c.TipoDoacao}</div>
          <div>Quantidade: {c.Quantidade}</div>
          <div>Meta: {c.Meta}</div>
          <div>Gastos: {c.Gastos}</div>
          <div>Fonte: {c.Fonte}</div>
          <div>Comprovante: {c.Comprovante}</div>
          <div className="text-gray-500 text-sm">
            Data: {new Date(c.DataContribuicao).toLocaleDateString()}
          </div>
        </div>
      ))}
    </>
  );
}
