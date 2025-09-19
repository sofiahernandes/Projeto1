"use client";

import React, { useState } from "react";

export default function DonationsForm() {
  const [idTime, setIdTime] = useState<number>(0);
  const [tipoDoacao, setTipoDoacao] = useState("");
  const [quantidade, setQuantidade] = useState<number>(0);
  const [fonte, setFonte] = useState("");
  const [meta, setMeta] = useState<number>(0);
  const [gastos, setGastos] = useState("");
  const [comprovante, setComprovante] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/createContribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          IdTime: idTime,
          TipoDoacao: tipoDoacao,
          Quantidade: quantidade,
          Fonte: fonte,
          Meta: meta,
          Gastos: gastos,
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

      setIdTime(0);
      setTipoDoacao("");
      setQuantidade(0);
      setFonte("");
      setMeta(0);
      setGastos("");
      setComprovante("");
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
        type="number"
        placeholder="Id do Time"
        value={idTime}
        onChange={(e) => setIdTime(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Tipo da Doação"
        value={tipoDoacao}
        onChange={(e) => setTipoDoacao(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Fonte"
        value={fonte}
        onChange={(e) => setFonte(e.target.value)}
      />
      <input
        type="number"
        placeholder="Meta"
        value={meta}
        onChange={(e) => setMeta(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Gastos"
        value={gastos}
        onChange={(e) => setGastos(e.target.value)}
      />
      <input
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
