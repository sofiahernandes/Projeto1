"use client";

import React from "react";

interface Properties {
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  meta: number;
  setMeta: React.Dispatch<React.SetStateAction<number>>;
  gastos: number;
  setGastos: React.Dispatch<React.SetStateAction<number>>;
  quantidade: number;
  setQuantidade: React.Dispatch<React.SetStateAction<number>>;
  comprovante: string;
  setComprovante: React.Dispatch<React.SetStateAction<string>>;
}

export default function DonationsForm({
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
  const toNum = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-xl bg-[#DCA4A9] p-4">
        <label className="block text-sm font-medium text-[#3B2A1A] mb-1">
          Nome do Evento / nome do doador
        </label>
        <input
          className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black px-3 py-1.5 mb-3"
          type="text"
          placeholder="Ex: Instituto Alma"
          value={fonte}
          onChange={(e) => setFonte(e.currentTarget.value)}
          required
        />

        <label className="block text-sm font-medium text-[#3B2A1A] mb-1">
          Meta
        </label>
        <input
          className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
          type="number"
          placeholder="Ex: R$100"
          value={meta}
          onChange={(e) => setMeta(toNum(e.target.value))}
          inputMode="decimal"
        />

        <label className="block text-sm font-medium text-[#3B2A1A] mb-1">
          Gastos
        </label>
        <input
          className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
          type="number"
          placeholder="Ex: R$100"
          value={gastos}
          onChange={(e) => setGastos(toNum(e.target.value))}
          inputMode="decimal"
        />

      <label>{tipoDoacao === "Financeira" ? "Valor (R$)" : "Quantidade (kg/unid)"}</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="number"
        placeholder="Ex: R$1000"
        value={quantidade ?? 0}                    
        onChange={(e) => setQuantidade(toNum(e.target.value))}
        inputMode="decimal"
        required
      />
 
      <label>Comprovante</label>
      <input
        className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none mb-2"
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}
        required={tipoDoacao === "Financeira"}
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
         </div>
    </div>
  );
}
