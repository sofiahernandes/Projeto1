"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        const res = await fetch(
          `http://localhost:3001/api/contributions/${userId}`
        );

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
    return <div>
              <div className="bg-[#d4ddd7] max-w-2xl mx-4 gap-4.5 rounded-sm p-2.5 ">
                <p className="text-gray-800">
                  Nenhuma contribuição encontrada. Adicione uma nova contribuição para
                  ver aqui!
                </p>
              </div>
              <Button className="justify-center self-center mt-4 ml-4 overflow-hidden h-10 gap-2 hover:bg-primary/20 hover:border-primary/60 border border-primary/40 transition-colors bg-white">
                <Link
                  href={`/${userId}/new-contribution`}
                  className="flex flex-col gap-2 items-center"
                >
                  <span className="text-sm text-gray-900 font-medium">
                    Registrar Doações
                  </span>
                </Link>
              </Button>
            </div>;
  }

  return (
    <div className="bg-[#d4ddd7] mx-4 grid grid-cols-1 md:grid-cols-3 gap-4.5 rounded-sm p-2.5">
      {contributions.map((c) => (
        <div
          key={c.IdContribuicao}
          className="bg-white p-4 rounded shadow-md flex flex-col gap-1"
        >
          <div className="font-semibold text-lg">Fonte: {c.Fonte}</div>
          <div className="text-gray-500 text-sm">
            Data: {new Date(c.DataContribuicao).toLocaleDateString()}
          </div>
          <div>Tipo de Doação: {c.TipoDoacao}</div>
          <div>Quantidade: {c.Quantidade}</div>
          {/* <div>Meta: {c.Meta}</div>
          <div>Gastos: {c.Gastos}</div> */}
          <div>Comprovante: {c.Comprovante}</div>
        </div>
      ))}
    </div>
  );
}
