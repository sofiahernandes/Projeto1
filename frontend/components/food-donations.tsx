"use client";

import React, { useEffect, useMemo, useState } from "react";

type AlimentoRow = {
  id: number;
  Nome: string;
  quantidade: string;
  pesoUnidade: string;
};

interface Properties {
  raUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number>>;
  tipoDoacao: string;
  setTipoDoacao: React.Dispatch<React.SetStateAction<string>>;
  quantidade: number | undefined;
  setQuantidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  pesoUnidade: number | undefined;
  setPesoUnidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  meta: number | undefined;
  setMeta: React.Dispatch<React.SetStateAction<number | undefined>>;
  gastos: number | undefined;
  setGastos: React.Dispatch<React.SetStateAction<number | undefined>>;
  onAlimentosChange?: (
    alimentos: { id: number; Nome: string; quantidade: string; pesoUnidade: string }[]
  ) => void;
  onTotaisChange?: (totais: { kgTotal: number; pontos: number }) => void;
}

export default function FoodDonations({
  raUsuario,
  setRaUsuario,
  tipoDoacao,
  setTipoDoacao,
  quantidade,
  setQuantidade,
  pesoUnidade,
  setPesoUnidade,
  fonte,
  setFonte,
  meta,
  setMeta,
  gastos,
  setGastos,
  onAlimentosChange,
  onTotaisChange,
}: Properties) {
  const [alimentos, setAlimentos] = useState<AlimentoRow[]>([
    { id: 1, Nome: "Arroz", quantidade: "", pesoUnidade: "" },
    { id: 2, Nome: "Feijão", quantidade: "", pesoUnidade: "" },
    { id: 3, Nome: "Macarrão", quantidade: "", pesoUnidade: "" },
    { id: 4, Nome: "Farinha de Mandioca", quantidade: "", pesoUnidade: "" },
    { id: 5, Nome: "Farinha de Trigo", quantidade: "", pesoUnidade: "" },
    { id: 6, Nome: "Leite Integral", quantidade: "", pesoUnidade: "" },
    { id: 7, Nome: "Açúcar Refinado", quantidade: "", pesoUnidade: "" },
    { id: 8, Nome: "Óleo de Soja", quantidade: "", pesoUnidade: "" },
    { id: 9, Nome: "Café em Pó", quantidade: "", pesoUnidade: "" },
    { id: 10, Nome: "Manteiga", quantidade: "", pesoUnidade: "" },
    { id: 11, Nome: "Sal", quantidade: "", pesoUnidade: "" },
    { id: 12, Nome: "Fubá", quantidade: "", pesoUnidade: "" },
    { id: 13, Nome: "Sardinha", quantidade: "", pesoUnidade: "" },
    { id: 14, Nome: "Polpa de Tomate", quantidade: "", pesoUnidade: "" },
    { id: 15, Nome: "Outros", quantidade: "", pesoUnidade: "" },
    { id: 16, Nome: "Ervilha Enlatada", quantidade: "", pesoUnidade: "" },
  ]);

  // pontos por kg (exemplo)
  const PONTOS_POR_KG: Record<string, number> = {
    Arroz: 3,
    Feijão: 5,
  };

  const parseNumber = (str: string | number): number => {
    if (typeof str === "number") return Number.isFinite(str) ? str : 0;
    const s = str.trim();
    if (s === "") return 0;
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const nearlyEqual = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

  const fmt2 = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // totais gerais
  const totais = useMemo(() => {
    let kgTotal = 0;
    let pontos = 0;
    for (const { Nome, quantidade, pesoUnidade } of alimentos) {
      const q = parseNumber(quantidade);
      const kgU = parseNumber(pesoUnidade);
      const kg = q * kgU;
      kgTotal += kg;
      const ptsKg = PONTOS_POR_KG[Nome] ?? 0;
      pontos += kg * ptsKg;
    }
    return { kgTotal, pontos };
  }, [alimentos]);

  // atualizar totais globais
  useEffect(() => {
    const somaQtd = alimentos.reduce((acc, a) => acc + parseNumber(a.quantidade), 0);
    const somaPeso = alimentos.reduce((acc, a) => acc + parseNumber(a.pesoUnidade), 0);
    const countPeso = alimentos.filter((a) => parseNumber(a.pesoUnidade) > 0).length;
    const mediaPeso = countPeso > 0 ? somaPeso / countPeso : 0;

    if (!nearlyEqual(somaQtd, quantidade ?? 0)) setQuantidade(somaQtd);
    if (!nearlyEqual(mediaPeso, pesoUnidade ?? 0)) setPesoUnidade(mediaPeso);
  }, [alimentos, quantidade, pesoUnidade, setQuantidade, setPesoUnidade]);

  // enviar para componente pai
  useEffect(() => {
    onAlimentosChange?.(alimentos);
  }, [alimentos, onAlimentosChange]);

  useEffect(() => {
    onTotaisChange?.(totais);
  }, [totais, onTotaisChange]);

  // atualizar alimento individual
  const handleAlimentoChange = (
    id: number,
    campo: "quantidade" | "pesoUnidade",
    valor: string
  ) => {
    const v = valor.replace(/\s+/g, "");
    // impede números decimais no campo de quantidade
    if (campo === "quantidade" && v.includes(".")) return;
    setAlimentos((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [campo]: v } : row))
    );
  };

  return (
    <form className="flex flex-col gap-2 w-full min-h-screen">
      <div>Nome do Evento</div>

      <input
        className="w-[80%] bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-black"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={fonte}
        onChange={(e) => setFonte(e.target.value)}
      />

      <div>Meta</div>
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <input
          className="w-[80%] bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-black"
          type="text"
          placeholder="Ex: 1200"
          value={meta ?? ""}
          onChange={(e) => {
            const raw = e.target.value;
            const num = raw === "" ? undefined : Number(raw.replace(",", "."));
            setMeta(Number.isFinite(num as number) ? (num as number) : undefined);
          }}
        />
        <div>Total em Kg </div>
        <div className="mb-4 flex items-center gap-3 flex-wrap">         
          <span className="w-[80%] bg-white border border-gray-300 rounded-lg px-10 py-1.5 text-black">
           {(quantidade ?? 0).toLocaleString("pt-BR")}
            </span>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="flex gap-4 font-bold">
        <div className="w-[30%] text-center">Alimento</div>
        <div className="w-[30%] text-center">Unidades</div>
        <div className="w-[30%] text-center">Kg/Unidade</div>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        {alimentos.map((a) => (
          <div key={a.id} className="flex gap-4 w-full">
            <div className="w-[30%] bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center px-3 py-2">
              {a.Nome}
            </div>
            <input
              className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center"
              type="number"
              placeholder="Qtd"
              value={a.quantidade}
              onChange={(e) =>
                handleAlimentoChange(a.id, "quantidade", e.target.value)
              }
              inputMode="numeric"
            />
            <input
              className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center"
              type="number"
              step="0.01"
              placeholder="Kg"
              value={a.pesoUnidade}
              onChange={(e) =>
                handleAlimentoChange(a.id, "pesoUnidade", e.target.value)
              }
              inputMode="decimal"
            />
          </div>
        ))}
      </div>
    </form>
  );
}
