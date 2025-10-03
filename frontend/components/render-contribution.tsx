"use client";

import React, {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {BookOpen} from "lucide-react";
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
    return <div>
              <p className="text-gray-800">Nenhuma contribuição encontrada. Adicione uma nova contribuição para ver aqui!</p>
              <Button className="overflow-hidden h-18 flex-col gap-2 hover:bg-primary/20 hover:border-primary/60 border border-primary/40 transition-colors bg-white">
                  <Link
                   href="/register/login"
                    className="flex flex-col gap-2 items-center"
                  >
                    <BookOpen className="w-6 h-6 text-gray-600" />
                    <span className="text-sm text-gray-900 font-medium">
                      Registrar Doações
                    </span>
                  </Link>
                </Button> 
           </div>;
  }

  return (
    <>
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
    </>
  );
}
