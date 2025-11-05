"use client";

import React, { useState } from "react";

interface Properties {
  raUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number | undefined>>;
  tipoDoacao: string;
  setTipoDoacao: React.Dispatch<React.SetStateAction<string>>;
  quantidade: number | undefined;
  setQuantidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  meta: number | undefined;
  setMeta: React.Dispatch<React.SetStateAction<number | undefined>>;
  gastos: number;
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
  const [tipoDoacao, setTipoDoacao] = useState<"Financeira" | "Alimenticia">("Financeira");
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const toNum = (v: string) => (v === "" ? undefined : Number(v));

  // URL da API (ajuste se precisar)
  const apiUrl =
    (process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:3001") +
    "/api/createContribution";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) {
      setComprovanteFile(null);
      setComprovante("");
      return;
    }

    const okType = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
    const okSize = file.size <= 5 * 1024 * 1024; // 5MB máx

    if (!okType) {
      alert("Apenas imagens PNG ou JPEG.");
      e.currentTarget.value = "";
      return;
    }
    if (!okSize) {
      alert("Arquivo muito grande (máx. 5MB).");
      e.currentTarget.value = "";
      return;
    }

    setComprovanteFile(file);
    setComprovante(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fonte.trim()) {
      alert("Informe o nome do evento/doador.");
      return;
    }
    if (quantidade === undefined) {
      alert("Informe o valor/quantidade.");
      return;
    }
    if (tipoDoacao === "Financeira" && !comprovanteFile) {
      alert("Comprovante é obrigatório para contribuição financeira.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Aqui é onde o FormData é criado e enviado
      const form = new FormData();
      form.append("Comprovante", comprovanteFile!); // ! porque já validamos antes
      form.append("RaUsuario", String(raUsuario ?? ""));
      form.append("TipoDoacao", tipoDoacao === "Financeira" ? "Alimenticia" : "Financeira");
      form.append("Quantidade", String(quantidade ?? ""));
      form.append("Meta", String(meta ?? ""));
      form.append("Gastos", String(gastos ?? ""));
      form.append("Fonte", fonte);

      const res = await fetch(apiUrl, {
        method: "POST",
        body: form, // NÃO colocar headers de Content-Type aqui
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erro ao cadastrar contribuição");
      }

      alert("Contribuição registrada com sucesso!");

      // Resetar os campos
      setFonte("");
      setQuantidade(undefined);
      setMeta(undefined);
      setGastos(undefined);
      setComprovante("");
      setComprovanteFile(null);
      setTipoDoacao("Financeira");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl">
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

        <label className="block text-sm font-medium text-[#3B2A1A] mb-1">Meta</label>
        <input
          className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black px-3 py-1.5 mb-3"
          type="number"
          placeholder="Ex: R$100"
          value={meta ?? ""}         
        />

        <label className="block text-sm font-medium text-[#3B2A1A] mb-1">Gastos</label>
        <input
          className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black px-3 py-1.5 mb-3"
          type="number"
          placeholder="Ex: R$100"
          value={gastos ?? ""}
          onChange={(e) => setGastos(toNum(e.currentTarget.value))}
        />

        <label className="block text-sm font-medium text-[#3B2A1A] mb-1">Valor R$</label>
        <input
          className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black px-3 py-1.5 mb-3"
          type="number"
          placeholder="Ex: R$140"
          value={quantidade ?? ""}
          onChange={(e) => setQuantidade(toNum(e.currentTarget.value))}
          required
        />

        <label className="block text-sm font-medium text-[#3B2A1A] mb-1">
          Comprovante (imagem PNG/JPEG)
          <span className="text-red-600"> *</span>
        </label>
        <input
          className="w-[80%] bg-white border border-[#CBB8A8] rounded-lg text-black px-3 py-1.5 mb-1"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          required={tipoDoacao === "Financeira"}
        />
        {comprovante && (
          <p className="text-xs text-gray-600 mb-3">Selecionado: {comprovante}</p>
        )}
      </div>
    </div>
  );
}
