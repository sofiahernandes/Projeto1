"use client";

import React, { useEffect, useMemo, useState } from "react";

// Tipo da linha do grid
type AlimentoRow = {
  id: number;
  Nome: string;
  quantidade: string;   
  pesoUnidade: string;  
};

interface Properties {
  raUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number | undefined>>;


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


  onAlimentosChange?: (alimentos: {
    id: number;
    Nome: string;
    quantidade: string;
    pesoUnidade: string;
  }[]) => void;
  onTotaisChange?: (totais: { kgTotal: number; pontos: number }) => void;
}

export default function FoodDonations({
  raUsuario,
  setRaUsuario,
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
    { id: 7, Nome: "Açucar Refinado", quantidade: "", pesoUnidade: "" },
    { id: 8, Nome: "Óleo de Soja", quantidade: "", pesoUnidade: "" },
    { id: 9, Nome: "Café em Pó", quantidade: "", pesoUnidade: "" },
    { id: 10, Nome: "Manteiga", quantidade: "", pesoUnidade: "" },
    { id: 11, Nome: "Sal", quantidade: "", pesoUnidade: "" },
    { id: 12, Nome: "Fubá", quantidade: "", pesoUnidade: "" },
    { id: 13, Nome: "Sardinha", quantidade: "", pesoUnidade: "" },
    { id: 14, Nome: "Polpa de Tomate", quantidade: "", pesoUnidade: "" },
    { id: 15, Nome: "Milho Enlatado", quantidade: "", pesoUnidade: "" },
    { id: 16, Nome: "Ervilha Enlatada", quantidade: "", pesoUnidade: "" },
  ]);

  // Pontos por KG (adicione regras se precisar)
  const PONTOS_POR_KG: Record<string, number> = {
    Arroz: 3,
    Feijão: 5,
  };

  // Converte string com vírgula/ponto em número seguro
  function parseNumber(str: string | number) {
    if (typeof str === "number") return Number.isFinite(str) ? str : 0;
    const s = String(str).trim();
    if (s === "") return 0;
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }

  const nearlyEqual = (a: number, b: number, eps = 1e-9) =>
    Math.abs(a - b) < eps;

  const fmt2 = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Totais do grid (kg e pontos)
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

  // 👉 AQUI: usamos (e atualizamos) os GLOBAIS do PAI de forma útil
  // quantidade (global) = SOMA de quantidades do grid
  // pesoUnidade (global) = MÉDIA de kg/unidade do grid
  useEffect(() => {
    const somaQtd = alimentos.reduce((acc, a) => acc + parseNumber(a.quantidade), 0);

    let somaPeso = 0;
    let countPeso = 0;
    for (const a of alimentos) {
      const p = parseNumber(a.pesoUnidade);
      if (p > 0) {
        somaPeso += p;
        countPeso += 1;
      }
    }
    const mediaPeso = countPeso > 0 ? somaPeso / countPeso : 0;
    
    if (!nearlyEqual(somaQtd, quantidade ?? 0)) {
      setQuantidade(somaQtd);
    }
    if (!nearlyEqual(mediaPeso, pesoUnidade ?? 0)) {
      setPesoUnidade(mediaPeso);
    }
  }, [alimentos, setQuantidade, setPesoUnidade]);

  // Callbacks p/ pai (se fornecidas)
  useEffect(() => {
    onAlimentosChange?.(
      alimentos.map(({ id, Nome, quantidade, pesoUnidade }) => ({
        id, Nome, quantidade, pesoUnidade,
      }))
    );
  }, [alimentos, onAlimentosChange]);

  useEffect(() => {
    onTotaisChange?.(totais);
  }, [totais, onTotaisChange]);

  // Handler de mudança no grid
  const handleAlimentoChange = (
    id: number,
    campo: "quantidade" | "pesoUnidade",
    valor: string
  ) => {
    // Remove espaços; deixa vírgula se o usuário quiser
    const v = valor.replace(/\s+/g, "");
    setAlimentos(prev =>
      prev.map(row => (row.id === id ? { ...row, [campo]: v } : row))
    );
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
        aria-label="Nome do evento"
      />

      <div>Meta</div>
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <input
          className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
          type="text"                 // aceita vírgula
          placeholder="Ex: 1200"
          value={meta ?? ""}
          onChange={(e) => {
            const raw = e.currentTarget.value;
            const num = raw === "" ? undefined : Number(raw.replace(",", "."));
            setMeta(Number.isFinite(num as number) ? (num as number) : undefined);
          }}
          inputMode="decimal"
          aria-label="Meta em kg"
        />

        {/* 👇 Mostra os GLOBAIS que agora são usados */}
        <div className="rounded-lg bg-white border border-[#BEB7AE] px-4 py-1.5 whitespace-nowrap w-[300px] overflow-hidden text-ellipsis">
          <span>Total em Kg:</span>
          <span className="ml-2">{(quantidade ?? 0).toLocaleString("pt-BR")}</span>
        </div>

        <div className="rounded-lg bg-white border border-[#BEB7AE] px-4 py-1.5 whitespace-nowrap w-[300px] overflow-hidden text-ellipsis">
          <span>Kg/Unid (média global):</span>
          <span className="ml-2">{fmt2(pesoUnidade ?? 0)}</span>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="flex gap-4 w-full font-bold">
        <div className="w-[30%] text-center">Alimento</div>
        <div className="w-[30%] text-center">Unidade</div>
        <div className="w-[30%] text-center">Kg/Unidade</div>
      </div>

      <div className="flex-1 min-h-0">

        <div id="FormAlimenticio" className="h-full overflow-auto pr-1 no-scrollbar">
          {alimentos.map((alimento) => (
            <div key={alimento.id} className="flex gap-4 w-full">
              {/* Nome do alimento */}
              <div className="w-[30%] bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center px-3 py-2 min-h-10 break-words [hyphens:auto]">
                {alimento.Nome}
              </div>

              {/* Unidade (quantidade) */}
              <input
                className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center appearance-none"
                type="text"
                placeholder="Unidade"
                value={alimento.quantidade}
                onChange={(e) =>
                  handleAlimentoChange(alimento.id, "quantidade", e.currentTarget.value)
                }
                inputMode="numeric"
                aria-label={`Quantidade de ${alimento.Nome}`}
              />

              {/* Kg por unidade */}
              <input
                className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center appearance-none"
                type="text"
                placeholder="Kg"
                value={alimento.pesoUnidade}
                onChange={(e) =>
                  handleAlimentoChange(alimento.id, "pesoUnidade", e.currentTarget.value)
                }
                inputMode="decimal"
                aria-label={`Kg por unidade de ${alimento.Nome}`}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}