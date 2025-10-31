"use client";

import React, { useEffect, useMemo, useState } from "react";
type Alimento = { nome: string; Unidade: string; Kg: string };


interface Properties {
  Unidade?: number;
  setUnidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  Kg?: number;
  setKg: React.Dispatch<React.SetStateAction<number | undefined>>;
  metaA?: number;
  setMetaA: React.Dispatch<React.SetStateAction<number | undefined>>;
  nomeEventoA: string;
  setNomeEventoA: React.Dispatch<React.SetStateAction<string>>;
  onAlimentosChange?: (alimentos: Alimento[]) => void;
  onTotaisChange?: (totais: { kgTotal: number; pontos: number }) => void;
}

export default function FoodDonations({
  Unidade,
  setUnidade,
  Kg,
  setKg,
  metaA,
  setMetaA,
  nomeEventoA,
  setNomeEventoA,
  onAlimentosChange,
  onTotaisChange,

}: Properties) {

  const ALIMENTO_SHAPE = { nome: "", Unidade: "", Kg: "" };
  

  // 🔹 useState tipado a partir da constante
  const [alimentos, setAlimentos] = useState<Array<typeof ALIMENTO_SHAPE>>([
    { nome: "Arroz", Unidade: "", Kg: "" },
    { nome: "Feijão", Unidade: "", Kg: "" },
    { nome: "Macarrão", Unidade: "", Kg: "" },
    { nome: "Farinha de Mandioca", Unidade: "", Kg: "" },
    { nome: "Farinha de Trigo", Unidade: "", Kg: "" },
    { nome: "Leite Integral", Unidade: "", Kg: "" },
    { nome: "Açucar Refinado", Unidade: "", Kg: "" },
    { nome: "Óleo de Soja", Unidade: "", Kg: "" },
    { nome: "Café em Pó", Unidade: "", Kg: "" },
    { nome: "Manteiga", Unidade: "", Kg: "" },
    { nome: "Sal", Unidade: "", Kg: "" },
    { nome: "Fubá", Unidade: "", Kg: "" },
    { nome: "Sardinha", Unidade: "", Kg: "" },
    { nome: "Polpa de Tomate", Unidade: "", Kg: "" },
    { nome: "Milho Enlatado", Unidade: "", Kg: "" },
    { nome: "Ervilha Enlatada", Unidade: "", Kg: "" },
  ]);

  // pontos por kg por produto (ajuste à vontade)
  const PONTOS_POR_KG: Record<string, number> = {
    Arroz: 3,
    Feijão: 5,
  };

  // helper para aceitar "2,5" e "2.5"
  function parseNumber(str: string | number) {
    if (typeof str === "number") return Number.isFinite(str) ? str : 0;
    const n = Number(str.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  // totais (kg e pontos) calculados a partir da tabela
  const totais = useMemo(() => {
    let kgTotal = 0;
    let pontos = 0;

    alimentos.forEach(({ nome, Unidade, Kg }) => {
      const u = parseNumber(Unidade); // unidades
      const kgPorUnidade = parseNumber(Kg); // kg por unidade
      const kg = u * kgPorUnidade;

      kgTotal += kg;

      const ptsKg = PONTOS_POR_KG[nome] ?? 0;
      pontos += kg * ptsKg;
    });

    return { kgTotal, pontos };
  }, [alimentos]); 

    useEffect(() => {
    onAlimentosChange?.(alimentos);
    onTotaisChange?.(totais);
  }, [alimentos, totais, onAlimentosChange, onTotaisChange]);


  // 🔧 ADICIONADO: formatador numérico pt-BR
  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

  const handleAlimentoChange = (
    index: number,
    campo: "Unidade" | "Kg",
    valor: string
  ) => {
    setAlimentos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [campo]: valor };
      return next;
    });

    const numero = valor === "" ? undefined : Number(valor);
    if (campo === "Unidade") setUnidade(numero);
    if (campo === "Kg") setKg(numero);
  };




  return (
    <form className="flex flex-col gap-2 w-full min-h-screen">
      <div className="">
  Nome do Evento
      </div>
    
      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-3"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={nomeEventoA}
        onChange={(e) => setNomeEventoA(e.target.value)}
      />

  Meta
      <div className="mb-4 flex items-center gap-3">
        <input
          className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
          type="number"
          placeholder="Ex: 1200 kg"
          value={metaA ?? ""} // 🔧 ADICIONADO (fallback)
          onChange={(e) => {
            const v = e.target.value;
            setMetaA(v === "" ? undefined : Number(v)); // 🔧 ADICIONADO (tratamento '')
          }}
        />
        <div className="rounded-lg bg-white border border-[#BEB7AE] px-4 py-1.5 whitespace-nowrap w-[300px] overflow-hidden text-ellipsis">
          <span className="">Total em Kg:</span>
          <span className="ml-2">{fmt(totais.kgTotal)}</span>
        </div>
      </div>


      {/* Cabeçalho */}
      <div className="flex gap-4 w-full font-bold">
        <div className="w-[30%] text-center">Alimento</div>
        <div className="w-[30%] text-center">Unidade</div>
        <div className="w-[30%] text-center">Kg/Unidade</div>
      </div>

  <div className="flex-1 min-h-0"> 
    <div className="h-full overflow-auto pr-1 no-scrollbar">
      {alimentos.map((alimento, index) => (
        <div key={alimento.nome} className="flex gap-4 w-full">
          {/* Nome do alimento */}
          <div className="w-[30%] bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center px-3 py-2 min-h-10 break-words [hyphens:auto]">
            {alimento.nome}
          </div>

          {/* Unidade */}
          <input
            className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center appearance-none"
            type="number"
            placeholder="Unidade"
            value={alimento.Unidade}
            onChange={(e) =>
              handleAlimentoChange(index, "Unidade", e.target.value)
            }
          />

          {/* Kg */}
          <input
            className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center appearance-none"
            type="number"
            placeholder="Kg"
            value={alimento.Kg}
            onChange={(e) => handleAlimentoChange(index, "Kg", e.target.value)}
          />
        </div>
      ))}
    </div>
   </div>
    </form>
  );
}
