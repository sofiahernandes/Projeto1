"use client";

import React, { useState } from "react";

interface Properties {
  raUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number>>;
  tipoDoacao: "Financeira" | "Alimenticia";
  setTipoDoacao: React.Dispatch<
    React.SetStateAction<"Financeira" | "Alimenticia">
  >;
  quantidade: number | undefined;
  setQuantidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  meta: number | undefined;
  setMeta: React.Dispatch<React.SetStateAction<number | undefined>>;
  gastos: number | undefined;
  setGastos: React.Dispatch<React.SetStateAction<number | undefined>>;
  comprovante: File | null;
  setComprovante: React.Dispatch<React.SetStateAction<File | null>>;
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
  const toNum = (v: string) => (v === "" ? undefined : Number(v));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) {
      setComprovante(null);
      return;
    }

    const okType = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
    const okSize = file.size <= 5 * 1024 * 1024;

    if (!okType) return alert("Apenas PNG/JPEG");
    if (!okSize) return alert("Arquivo muito grande (máx. 5MB)");

    setComprovante(file);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-xl p-4">
        <label className="block mb-1">Nome do Evento / doador</label>
        <input
          type="text"
          placeholder="Ex: Instituto Alma"
          value={fonte}
          onChange={(e) => setFonte(e.currentTarget.value)}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
          required
        />

        <label className="block mb-1 mt-3">Meta</label>
        <input
          type="number"
          placeholder="Ex: R$100"
          value={meta ?? ""}
          onChange={(e) => setMeta(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Gastos</label>
        <input
          type="number"
          placeholder="Ex: R$100"
          value={gastos ?? ""}
          onChange={(e) => setGastos(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Valor R$</label>
        <input
          type="number"
          placeholder="Ex: R$140"
          value={quantidade ?? ""}
          onChange={(e) => setQuantidade(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
          required
        />

        <label className="block mb-1 mt-3">Comprovante (PNG/JPEG)</label>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
        />
        {comprovante && (
          <p className="text-xs text-gray-600 mt-1">
            Selecionado: {comprovante.name}
          </p>
        )}
      </div>
    </div>
  );
}
