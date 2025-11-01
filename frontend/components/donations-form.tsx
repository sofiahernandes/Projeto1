"use client";

import React, { useState } from "react";

interface Properties {
  raUsuario: number
  setRaUsuario: React.Dispatch<React.SetStateAction<number | undefined>>
  tipoDoacao: string
  setTipoDoacao: React.Dispatch<React.SetStateAction<string>>
  quantidade: number
  setQuantidade: React.Dispatch<React.SetStateAction<number | undefined>>
  fonte: string
  setFonte: React.Dispatch<React.SetStateAction<string>>
  meta: number
  setMeta: React.Dispatch<React.SetStateAction<number | undefined>>
  gastos: number
  setGastos: React.Dispatch<React.SetStateAction<number | undefined>>
  comprovante: string
  setComprovante: React.Dispatch<React.SetStateAction<string>>
}

export default function DonationsForm({
  raUsuario,
  setRaUsuario,
  quantidade,
  setQuantidade,
  fonte,
  setFonte,
  meta,
  setMeta,
  gastos,
  setGastos,
  comprovante,
  setComprovante,
  
}: Properties) {
const [tipoDoacao, setTipoDoacao] = useState<"Financeira" | "Alimenticia">("Financeira");
  // helper para converter string -> número (aceita vazio)
  const toNum = (s: string): number | undefined => {
    const trimmed = s.trim();
    if (trimmed === "") return undefined;
    const n = Number(trimmed.replace(",", ".")); // aceita 1,5
    return Number.isFinite(n) ? n : undefined;
  };
  
 const [loading, setLoading] = useState(false);
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/createContribution";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RaUsuario: Number(raUsuario),
          TipoDoacao: tipoDoacao,
          Quantidade: Number(quantidade),
          Meta: Number(meta),
          Gastos: Number(gastos),
          Fonte: fonte,
          Comprovante: comprovante,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Erro ao cadastrar contribuição");
        return;
      }

      const data = await res.json();
      alert("Contribuição registrada com sucesso!");
      console.log("Contribuição criada:", data);
    } catch (error) {
      console.error("Erro ao enviar contribuição:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };
    
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xl">
      <label className="text-[#3B2A1A]">Nome do Evento / nome do doador</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={fonte}                 
        onChange={(e) => setFonte(e.target.value)} 
      />

      <label>Meta</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="number"
        placeholder="Ex: R$100"
        value={meta}                    
        onChange={(e) => setMeta(toNum(e.target.value))}
        inputMode="decimal"
      />

      <label>Gastos</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="number"
        placeholder="Ex: R$100"
        value={gastos}                   
        onChange={(e) => setGastos(toNum(e.target.value))}
        inputMode="decimal"
      />

      <label>Valor Arrecadado</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="number"
        placeholder="Ex: R$1000"
        value={quantidade}                    
        onChange={(e) => setQuantidade(toNum(e.target.value))}
        inputMode="decimal"
      />
 
      <label>Comprovante (link do arquivo)</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="text"
        placeholder="URL do comprovante"
        value={comprovante}
        onChange={(e) => setComprovante(e.target.value)}
      />
         <div className = "flex justify-end">
      <button
        type="submit"
        disabled={loading}
        onClick={() => setTipoDoacao("Financeira")}
        className="mt-2 w-fit bottom-10 right-14 px-10 py-2 rounded-lg bg-[#B27477] houver: bg-[#9B5B60] text-white disabled:opacity-50"
      >
        {loading ? "Casdastrando..." : "Cadastrar"}
      </button>
         </div>
    </form>
  );
}