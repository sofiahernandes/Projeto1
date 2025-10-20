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
  tipoDoacao,
  setTipoDoacao,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none "
        type="number"
        placeholder="Id do Time"
        value={raUsuario}
        onChange={(e) => setRaUsuario(Number(e.target.value))
        }
      />
      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none "
        type="text"
        placeholder="Tipo da Doação"
        value={tipoDoacao}
        onChange={(e) => setTipoDoacao(e.target.value)}
      />
      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none "
        type="number"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(Number(e.target.value))}
      />
      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none "
        type="text"
        placeholder="Fonte"
        value={fonte}
        onChange={(e) => setFonte(e.target.value)}
      />
      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none "
        type="number"
        placeholder="Meta"
        value={meta}
        onChange={(e) => setMeta(Number(e.target.value))}
      />
      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none "
        type="number"
        placeholder="Gastos"
        value={gastos}
        onChange={(e) => setGastos(Number(e.target.value))}
      />
      <input
        className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none "
        type="text"
        placeholder="Comprovante (link do arquivo)"
        value={comprovante}
        onChange={(e) => setComprovante(e.target.value)}
      />

      <button
        type="submit"
        className="bg-primary text-white rounded-lg py-2 px-6 hover:bg-[#354F52]"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Cadastrar"}
      </button>
    </form>
  );
}
