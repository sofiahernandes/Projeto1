"use client";

import React, { useState } from "react";

interface Properties {
  nomeEventoF: string;
  setNomeEventoF: React.Dispatch<React.SetStateAction<string>>;
  metaF?: number;
  setMetaF: React.Dispatch<React.SetStateAction<number | undefined>>;
  gastos?: number;
  setGastos: React.Dispatch<React.SetStateAction<number | undefined>>;
  valorarrecadado?: number;
  setValorArrecadado: React.Dispatch<React.SetStateAction<number | undefined>>;
  comprovante: string;
  setComprovante: React.Dispatch<React.SetStateAction<string>>;
}

export default function DonationsForm({
  nomeEventoF,
  setNomeEventoF,
  metaF,
  setMetaF,
  gastos,
  setGastos,
  comprovante,
  setComprovante,
  valorarrecadado,
  setValorArrecadado,
}: Properties) {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados locais como string para inputs numéricos (digitação mais suave)
  const [metaStr, setMetaStr] = useState(metaF != null ? String(metaF) : "");
  const [gastosStr, setGastosStr] = useState(gastos != null ? String(gastos) : "");
  const [valorStr, setValorStr] = useState(
    valorarrecadado != null ? String(valorarrecadado) : ""
  );

  // helper para converter string -> número (aceita vazio)
  const toNum = (s: string): number | undefined => {
    const trimmed = s.trim();
    if (trimmed === "") return undefined;
    const n = Number(trimmed.replace(",", ".")); // aceita 1,5
    return Number.isFinite(n) ? n : undefined;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOk(false);
    setError(null);
    // Converte strings para número e reflete nas props controladas
    const metaNum = toNum(metaStr);
    const gastosNum = toNum(gastosStr);
    const valorNum = toNum(valorStr);

    setMetaF(metaNum);
    setGastos(gastosNum);
    setValorArrecadado(valorNum);

    try {
      const res = await fetch("http://localhost:3001/api/createContribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Atenção: mantendo a grafia usada por você
          MetaF: Number(metaNum ?? 0),
          Gastos: Number(gastosNum ?? 0),
          Fonte: nomeEventoF,
          Comprovante: comprovante,
          ValorArregadado: Number(valorNum ?? 0),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err?.error || `Erro ao cadastrar contribuição (${res.status})`);
      }

      const data = await res.json().catch(() => ({} as any));
      console.log("Contribuição criada:", data);
      setOk(true);

      // Reset de campos
      setNomeEventoF("");
      setComprovante("");
      setMetaStr("");
      setGastosStr("");
      setValorStr("");
      setMetaF(undefined);
      setGastos(undefined);
      setValorArrecadado(undefined);
    } catch (e: any) {
      console.error("Erro ao enviar contribuição:", e);
      setError(e?.message ?? "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xl">
      {/* Banners de sucesso/erro */}
      {ok && (
        <div className="rounded-lg border border-green-300 bg-green-50 text-green-800 px-4 py-2">
          Contribuição registrada com sucesso!
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 text-red-800 px-4 py-2">
          {error}
        </div>
      )}

      <label className="text-[#3B2A1A]">Nome do Evento / nome do doador</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={nomeEventoF}                 
        onChange={(e) => setNomeEventoF(e.target.value)} 
      />

      <label>Meta</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="number"
        placeholder="Ex: R$100"
        value={metaStr}                    
        onChange={(e) => setMetaStr(e.target.value)}
        inputMode="decimal"
      />

      <label>Gastos</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="number"
        placeholder="Ex: R$100"
        value={gastosStr}                   
        onChange={(e) => setGastosStr(e.target.value)}
        inputMode="decimal"
      />

      <label>Valor Arrecadado</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="number"
        placeholder="Ex: R$1000"
        value={valorStr}                    
        onChange={(e) => setValorStr(e.target.value)}
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
        className="mt-2 w-fit bottom-10 right-14 px-10 py-2 rounded-lg bg-[#B27477] houver: bg-[#9B5B60] text-white disabled:opacity-50"
      >
        {loading ? "Casdastrando..." : "Cadastrar"}
      </button>
         </div>
    </form>
  );
}