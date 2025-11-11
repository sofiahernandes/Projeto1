"use client";

import Image, { StaticImageData } from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import uploadStatic from "@/assets/icons/upload-static.png";
import uploadGif from "@/assets/icons/upload-anim.gif";

type Img = StaticImageData | string;

interface Properties {
  quantidade: number;
  setQuantidade: (value: number) => void;
  pesoUnidade: number;
  setPesoUnidade: (value: number) => void;
  comprovante: File | null;
  setComprovante: (value: File | null) => void;
  fonte: string;
  setFonte: (value: string) => void;
  meta: number;
  setMeta: (value: number) => void;
  idAlimento: number;
  setIdAlimento: (value: number) => void;
  gastos: number;
  setGastos: (value: number) => void;
  onTotaisChange?: (totais: {
    pontos: number;
    kgTotal: number;
    gastos: number;
  }) => void;
  onAlimentoChange?: (alimentoAtual: {
    id: number;
    quantidade: number;
    pesoUnidade: number;
  }) => void;
}

export default function FoodDonations({
  fonte,
  setFonte,
  meta,
  setMeta,
  gastos,
  setGastos,
  quantidade,
  setQuantidade,
  pesoUnidade,
  setPesoUnidade,
  idAlimento,
  setIdAlimento,
  comprovante,
  setComprovante,
  onTotaisChange,
  onAlimentoChange,
}: Properties) {
  const [loading, setLoading] = useState(false);
  const [picking, setPicking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const ALIMENTOS = [
    { id: 1, nome: "Arroz Polido" },
    { id: 2, nome: "Feijão Preto" },
    { id: 3, nome: "Macarrão" },
    { id: 4, nome: "Fubá" },
    { id: 5, nome: "Leite em Pó" },
    { id: 6, nome: "Açúcar Refinado" },
    { id: 7, nome: "Óleo de Soja" },
    { id: 8, nome: "Outros" },
  ];

  const PONTOS_POR_KG: Record<string, number> = {
    "Arroz Polido": 5,
    "Feijão Preto": 5,
    "Açúcar Refinado": 4,
    "Leite em Pó": 37.5,
    Fubá: 5,
    Macarrão: 5,
    "Óleo de Soja": 7,
    Outros: 0,
  };

  useEffect(() => {
    if (!Number.isInteger(idAlimento)) setIdAlimento(0);
    if (!Number.isInteger(quantidade ?? 0)) setQuantidade(0);
    if (!Number.isInteger(pesoUnidade ?? 0)) setPesoUnidade(0);
    if (!Number.isFinite(gastos)) setGastos(0);
  }, []);

  useEffect(() => {
    if (onAlimentoChange) {
      onAlimentoChange({
        id: idAlimento,
        quantidade: quantidade ?? 0,
        pesoUnidade: pesoUnidade ?? 0,
      });
    }
  }, [idAlimento, quantidade, pesoUnidade]);

  const totais = useMemo(() => {
    const nome = ALIMENTOS.find((a) => a.id === (idAlimento ?? 0))?.nome ?? "";
    const q = Math.floor(quantidade ?? 0);
    const p = Math.floor(pesoUnidade ?? 0);
    const kgTotal = q * p;
    const pontos = kgTotal * (PONTOS_POR_KG[nome] ?? 0);
    return { kgTotal, pontos };
  }, [idAlimento, quantidade, pesoUnidade]);

  useEffect(() => {
    onTotaisChange?.({
      pontos: totais.pontos,
      kgTotal: totais.kgTotal,
      gastos: gastos ?? 0,
    });
  }, [totais, gastos]);

  const stopGif = () => {
    setPicking(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePickClick = () => {
    if (loading) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) {
      setComprovante(null);
      stopGif();
      return;
    }

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    const isValidType = validTypes.includes(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isValidType) {
      alert("Formato inválido. Use PNG, JPEG ou PDF.");
      stopGif();
      return;
    }

    if (!isValidSize) {
      alert("Arquivo muito grande (máx. 5MB).");
      stopGif();
      return;
    }

    setPicking(true);
    setComprovante(file);
    e.target.value = "";

    // Para o GIF depois de 1s
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => stopGif(), 1000);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <label>Nome do Evento</label>
      <input
        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-black"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={fonte}
        onChange={(e) => setFonte(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div>
          <label>Meta</label>
          <input
            className="h-10 w-full bg-white border border-gray-300 rounded-lg px-3"
            type="number"
            placeholder="100 Kg"
            value={meta === 0 ? "" : meta}
            onChange={(e) => {
              const v = e.target.value;
              setMeta(v === "" ? 0 : Math.floor(Number(v)));
            }}
          />
        </div>

        <div>
          <label>Gastos</label>
          <input
            className="h-10 w-full bg-white border border-gray-300 rounded-lg px-3"
            type="number"
            placeholder="Ex: R$100"
            value={gastos === 0 ? "" : gastos}
            onChange={(e) => {
              const v = e.target.value;
              setGastos(v === "" ? 0 : Math.floor(Number(v)));
            }}
          />
        </div>

        <div>
          <label>Total em Kg</label>
          <input
            type="text"
            readOnly
            value={totais.kgTotal.toLocaleString("pt-BR")}
            className="h-10 w-full bg-white border border-gray-300 rounded-lg px-3 text-center"
          />
        </div>
      </div>

      <div className="flex gap-4 font-bold mt-2">
        <div className="w-[40%] text-center">Alimento</div>
        <div className="w-[25%] text-center">Unidades</div>
        <div className="w-[25%] text-center">Kg/Unidade</div>
      </div>

      <div className="flex gap-4 mt-2">
        <select
          className="w-[40%] bg-white border border-gray-300 rounded-lg px-3 py-2"
          value={idAlimento}
          onChange={(e) => setIdAlimento(parseInt(e.target.value))}
        >
          {ALIMENTOS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>

        <input
          className="w-[25%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center"
          type="number"
          placeholder="Qtd"
          value={quantidade === 0 ? "" : quantidade}
          onChange={(e) => {
            const v = e.target.value;
            setQuantidade(v === "" ? 0 : Math.floor(Number(v)));
          }}
        />

        <input
          className="w-[25%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center"
          type="number"
          step="1"
          placeholder="Kg"
          value={pesoUnidade === 0 ? "" : pesoUnidade}
          onChange={(e) => {
            const v = e.target.value;
            setPesoUnidade(v === "" ? 0 : Math.floor(Number(v)));
          }}
        />
      </div>

      <label className="block mt-9">Imagem dos Alimentos (PNG/JPEG/PDF)</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center">
        <button
          type="button"
          onClick={handlePickClick}
          className="inline-flex items-center justify-center h-14 w-18 rounded-lg bg-white transition"
          disabled={loading}
        >
          <Image
            src={picking ? (uploadGif as Img) : (uploadStatic as Img)}
            alt="Selecionar comprovante"
            width={35}
            height={35}
            draggable={false}
          />
        </button>
        <span className="ml-3 text-sm text-gray-700">
          {comprovante instanceof File
            ? `Selecionado: ${comprovante.name}`
            : "Nenhum arquivo escolhido"}
        </span>
      </div>
    </div>
  );
}
