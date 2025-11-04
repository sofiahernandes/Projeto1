"use client";

import React, { useEffect, useMemo, useState } from "react";

// Tipo que suas callbacks esperam (nome minúsculo)
type Alimento = { Nome: string; quantidade: string; pesoUnidade: string };

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
 

type AlimentoRow = {
  id: number;
  Nome: string;
  quantidade: string;   // antes: Unidade
  pesoUnidade: string;  // antes: Kg
};

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

  const PONTOS_POR_KG: Record<string, number> = {
    "Arroz": 3,
    "Feijão": 5,
  };

  function parseNumber(str: string | number) {   
   if (typeof str === "number") return Number.isFinite(str) ? str : 0;
    const s = String(str).trim();
    if (s === "") return 0;                             // evita NaN
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });


const totais = useMemo(() => {
  let kgTotal = 0, pontos = 0;
  alimentos.forEach(({ Nome, quantidade, pesoUnidade }) => {
    const q = parseNumber(quantidade);
    const kgU = parseNumber(pesoUnidade);
    const kg = q * kgU;
    kgTotal += kg;
    const ptsKg = PONTOS_POR_KG[Nome] ?? 0;
    pontos += kg * ptsKg;
  });
  return { kgTotal, pontos };
}, [alimentos]);



useEffect(() => {
  onAlimentosChange?.(
    (alimentos ?? []).map(({ id, Nome, quantidade, pesoUnidade }) => ({
      id,
      Nome,
      quantidade,
      pesoUnidade,
    }))
  );
}, [alimentos, onAlimentosChange]);


  useEffect(() => {
    onTotaisChange?.(totais);
  }, [totais, onTotaisChange]);

  const handleAlimentoChange = (
    id: number,
    campo: "quantidade" | "pesoUnidade",
    valor: string
  ) => {
    setAlimentos((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [campo]: valor } : row
      )
    );

    const numero = valor === "" ? undefined : Number(valor.replace(",", "."));
    if (campo === "quantidade") setQuantidade(numero);
    if (campo === "pesoUnidade") setPesoUnidade(numero);
  };
  
  // (Opcional) helper para montar payload no shape do back
  // const buildPayload = () =>
  //   alimentos.map(({ id, Nome, Unidade, Kg }) => ({
  //     alimentoId: id,
  //     Nome: Nome,
  //     alimento: {
  //       Unidade: Number(String(Unidade).replace(",", ".")) || 0,
  //       Kg: Number(String(Kg).replace(",", ".")) || 0,
  //     },
  //     totalKg:
  //       (Number(String(Unidade).replace(",", ".")) || 0) *
  //       (Number(String(Kg).replace(",", ".")) || 0),
  //   }));



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
          type="text"
          placeholder="Ex: 1200 kg"
          value={meta ?? ""}
          onChange={(e) => {
         const v = e.currentTarget.value;
          setMeta(v === "" ? undefined : Number(v));
          }}
          inputMode="numeric"
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
        <form id="FormAlimenticio" className= "h-full overflow-auto pr-1 no-scrollbar">
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
                value={alimento.quantidade ?? ""}
                onChange={(e) =>
                handleAlimentoChange(alimento.id, "quantidade", e.currentTarget.value)
                }
                inputMode="numeric"
              />
             {/* pesoUnidade*/}
              <input
                className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center appearance-none"
                type="number"
                placeholder="Kg"
                value={alimento.pesoUnidade}
                onChange={(e) =>
                handleAlimentoChange(alimento.id, "pesoUnidade", e.currentTarget.value)
                }
                inputMode="decimal"
              />
            </div>
          ))}
        </form>
      </div>
    </form>
  );
}
