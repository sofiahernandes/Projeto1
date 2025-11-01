"use client";

import React, { useEffect, useMemo, useState } from "react";

// Tipo que suas callbacks esperam (nome minúsculo)
type Alimento = { nome: string; Unidade: string; Kg: string };

interface Properties {
  raUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number | undefined>>;
  tipoDoacao: string;
  setTipoDoacao: React.Dispatch<React.SetStateAction<string>>;
  quantidade: number;
  setQuantidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  pesoUnidade: number;
  setPesoUnidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  meta: number;
  setMeta: React.Dispatch<React.SetStateAction<number | undefined>>;
  gastos: number;
  setGastos: React.Dispatch<React.SetStateAction<number | undefined>>;
  comprovante: string;
  setComprovante: React.Dispatch<React.SetStateAction<string>>;
  onAlimentosChange?: (alimentos: Alimento[]) => void;
  onTotaisChange?: (totais: { kgTotal: number; pontos: number }) => void;
}

export default function FoodDonations({
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
  pesoUnidade,
  setPesoUnidade,
  onAlimentosChange,
  onTotaisChange,
}: Properties) {

  type AlimentoRow = { id: number; Nome: string; Unidade: string; Kg: string };
  const ALIMENTO_SHAPE: AlimentoRow = { id: 0, Nome: "", Unidade: "", Kg: "" };

  const [alimentos, setAlimentos] = useState<AlimentoRow[]>([
    { id: 1, Nome: "Arroz", Unidade: "", Kg: "" },
    { id: 2, Nome: "Feijão", Unidade: "", Kg: "" },
    { id: 3, Nome: "Macarrão", Unidade: "", Kg: "" },
    { id: 4, Nome: "Farinha de Mandioca", Unidade: "", Kg: "" },
    { id: 5, Nome: "Farinha de Trigo", Unidade: "", Kg: "" },
    { id: 6, Nome: "Leite Integral", Unidade: "", Kg: "" },
    { id: 7, Nome: "Açucar Refinado", Unidade: "", Kg: "" },
    { id: 8, Nome: "Óleo de Soja", Unidade: "", Kg: "" },
    { id: 9, Nome: "Café em Pó", Unidade: "", Kg: "" },
    { id: 10, Nome: "Manteiga", Unidade: "", Kg: "" },
    { id: 11, Nome: "Sal", Unidade: "", Kg: "" },
    { id: 12, Nome: "Fubá", Unidade: "", Kg: "" },
    { id: 13, Nome: "Sardinha", Unidade: "", Kg: "" },
    { id: 14, Nome: "Polpa de Tomate", Unidade: "", Kg: "" },
    { id: 15, Nome: "Milho Enlatado", Unidade: "", Kg: "" },
    { id: 16, Nome: "Ervilha Enlatada", Unidade: "", Kg: "" },
  ]);

  const PONTOS_POR_KG: Record<string, number> = {
    "Arroz": 3,
    "Feijão": 5,
  };

  function parseNumber(str: string | number) {
    if (typeof str === "number") return Number.isFinite(str) ? str : 0;
    const n = Number(String(str).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

  const totais = useMemo(() => {
    let kgTotal = 0;
    let pontos = 0;

    alimentos.forEach(({ Nome, Unidade, Kg }) => {
      const u = parseNumber(Unidade);    
      const kgPorUnidade = parseNumber(Kg); 
      const kg = u * kgPorUnidade;

      kgTotal += kg;
      const ptsKg = PONTOS_POR_KG[Nome] ?? 0;
      pontos += kg * ptsKg;
    });

    return { kgTotal, pontos };
  }, [alimentos]);

  useEffect(() => {
    onAlimentosChange?.(
      alimentos.map(({ id, Nome, Unidade, Kg }) => ({
        nome: Nome,
        Unidade,
        Kg,
      }))
    );
  }, [alimentos, onAlimentosChange]);

  useEffect(() => {
    onTotaisChange?.(totais);
  }, [totais, onTotaisChange]);

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

    const numero = valor === "" ? undefined : Number(valor.replace(",", "."));
    if (campo === "Unidade") setQuantidade(numero);
    if (campo === "Kg") setPesoUnidade(numero);
  };


  return (
    <form className="flex flex-col gap-2 w-full min-h-screen">
      <div>Nome do Evento</div>

      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-3"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={fonte}
        onChange={(e) => setFonte(e.currentTarget.value)}
      />

      <div>Meta</div>
      <div className="mb-4 flex items-center gap-3">
        <input
          className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
          type="number"
          placeholder="Ex: 1200 kg"
          value={meta ?? ""}
          onChange={(e) => {
            const v = e.currentTarget.value;
            setMeta(v === "" ? undefined : Number(v));
          }}
          inputMode="decimal"
        />
        <div className="rounded-lg bg-white border border-[#BEB7AE] px-4 py-1.5 whitespace-nowrap w-[300px] overflow-hidden text-ellipsis">
          <span>Total em Kg:</span>
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
            <div key={alimento.id} className="flex gap-4 w-full">
              {/* Nome do alimento */}
              <div className="w-[30%] bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center px-3 py-2 min-h-10 break-words [hyphens:auto]">
                {alimento.Nome}
              </div>

              {/* Unidade (quantidade) */}
              <input
                className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center appearance-none"
                type="number"
                placeholder="Unidade"
                value={alimento.Unidade}
                onChange={(e) =>
                  handleAlimentoChange(index, "Unidade", e.currentTarget.value)
                }
                inputMode="numeric"
              />

              <input
                className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center appearance-none"
                type="number"
                placeholder="Kg"
                value={alimento.Kg}
                onChange={(e) =>
                  handleAlimentoChange(index, "Kg", e.currentTarget.value)
                }
                inputMode="decimal"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
