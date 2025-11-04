"use client";

import React, { useState } from "react";

interface Properties {
  raUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number | undefined>>;
  tipoDoacao: "Financeira" | "Alimenticia";
  setTipoDoacao: React.Dispatch<React.SetStateAction<"Financeira" | "Alimenticia">>;
  quantidade: number | undefined;
  setQuantidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  meta: number | undefined;
  setMeta: React.Dispatch<React.SetStateAction<number | undefined>>;
  gastos: number | undefined;
  setGastos: React.Dispatch<React.SetStateAction<number | undefined>>;
  comprovante: string;
  setComprovante: React.Dispatch<React.SetStateAction<string>>;
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
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const toNum = (v: string) => (v === "" ? undefined : Number(v));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) {
      setComprovanteFile(null);
      setComprovante("");
      return;
    }

    const okType = ["image/png", "image/jpeg"].includes(file.type);
    const okSize = file.size <= 5 * 1024 * 1024;

    if (!okType) return alert("Apenas PNG/JPEG");
    if (!okSize) return alert("Arquivo muito grande (máx. 5MB)");

    setComprovanteFile(file);
    setComprovante(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fonte.trim()) return alert("Informe o nome do evento/doador");
    if (quantidade === undefined) return alert("Informe o valor/quantidade");

    setLoading(true);
    try {
      const form = new FormData();
      if (comprovanteFile) form.append("Comprovante", comprovanteFile);
      form.append("RaUsuario", String(raUsuario));
      form.append("Quantidade", String(quantidade ?? ""));
      form.append("Meta", String(meta ?? ""));
      form.append("Gastos", String(gastos ?? ""));
      form.append("Fonte", fonte);

      const res = await fetch("/api/createContribution", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Contribuição registrada com sucesso!");

      // Resetar campos
      setFonte("");
      setQuantidade(undefined);
      setMeta(undefined);
      setGastos(undefined);
      setComprovante("");
      setComprovanteFile(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro de conexão");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl">
      <div className="rounded-xl bg-[#DCA4A9] p-4">
        <label className="block mb-1">Nome do Evento / doador</label>
        <input
          type="text"
          placeholder="Ex: Instituto Alma"
          value={fonte}
          onChange={(e) => setFonte(e.currentTarget.value)}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
          required
        />

        <label className="block mb-1">Meta</label>
        <input
          type="number"
          placeholder="Ex: R$100"
          value={meta ?? ""}
          onChange={(e) => setMeta(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
        />

        <label className="block mb-1">Gastos</label>
        <input
          type="number"
          placeholder="Ex: R$100"
          value={gastos ?? ""}
          onChange={(e) => setGastos(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
        />

        <label className="block mb-1">Valor R$</label>
        <input
          type="number"
          placeholder="Ex: R$140"
          value={quantidade ?? ""}
          onChange={(e) => setQuantidade(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
          required
        />

        <label className="block mb-1">Comprovante (PNG/JPEG)</label>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="w-[80%] bg-white border rounded px-3 py-1.5"
        />
        {comprovante && <p className="text-xs text-gray-600">Selecionado: {comprovante}</p>}
      </div>
    </form>
  );
}
