"use client";

import React, { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

import uploadStatic from "@/assets/icons/upload-static.png";
import uploadGif from "@/assets/icons/upload-anim.gif";

type Img = StaticImageData | string;

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
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // --- picker com GIF ---
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [picking, setPicking] = useState(false);
  const timerRef = useRef<number | null>(null);

  const toNum = (v: string) => (v === "" ? undefined : Number(v));

  // CSS da animação "pop" (se ainda não tiver global)
  // Você pode mover isso para o layout global se preferir.
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pop {
        0% { transform: scale(1); }
        40% { transform: scale(1.12); }
        100% { transform: scale(1); }
      }
      .animate-pop { animation: pop 150ms ease-out; }
      @media (prefers-reduced-motion: reduce) {
        .animate-pop { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const stopGif = () => {
    setPicking(false);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePickClick = () => {
    if (loading) return;
    setPicking(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      stopGif();
    }, 1000); 
    fileInputRef.current?.click();
  };


  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;

    if (!file) {
      setComprovanteFile(null);
      setComprovante("");
      stopGif();
      return;
    }

    const okType = ["image/png", "image/jpeg"].includes(file.type);
    const okSize = file.size <= 5 * 1024 * 1024;

    if (!okType) {
      alert("Apenas PNG/JPEG");
      stopGif();
      return;
    }
    if (!okSize) {
      alert("Arquivo muito grande (máx. 5MB)");
      stopGif();
      return;
    }

    setComprovanteFile(file);
    setComprovante(file.name);
    stopGif();
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
      form.append("TipoDoacao", tipoDoacao); // já que está no contrato do componente

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
      <div className="rounded-xl p-4">
        <label className="block mb-1">Nome do Evento / doador</label>
        <input
          type="text"
          placeholder="Ex: Instituto Alma"
          value={fonte}
          onChange={(e) => setFonte(e.currentTarget.value)}
          className="w-[80%] bg-white border border-gray-300 rounded px-3 py-1.5"
          required
        />

        <label className="block mb-1">Meta</label>
        <input
          type="number"
          placeholder="Ex: R$100"
          value={meta ?? ""}
          onChange={(e) => setMeta(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border border-gray-300 rounded px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Gastos</label>
        <input
          type="number"
          placeholder="Ex: R$100"
          value={gastos ?? ""}
          onChange={(e) => setGastos(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border border-gray-300 rounded px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Valor R$</label>
        <input
          type="number"
          placeholder="Ex: R$140"
          value={quantidade ?? ""}
          onChange={(e) => setQuantidade(toNum(e.currentTarget.value))}
          className="w-[80%] bg-white border border-gray-300 rounded px-3 py-1.5"
          required
        />

        {/* --- Arquivo (ícone + gif) --- */}
        <label className="block mb-1 mt-3">Comprovante (PNG/JPEG)</label>

        {/* Input real (escondido) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* Botão com ícone/gif */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handlePickClick}
            onMouseDown={(e) => e.currentTarget.classList.add("animate-pop")}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("animate-pop")}
            className="inline-flex items-center justify-center h-14 w-18 rounded-lg bg-white transition"
            disabled={loading}
            aria-label="Selecionar comprovante"
          >
            <Image
              src={picking ? (uploadGif as Img) : (uploadStatic as Img)}
              alt="Selecionar comprovante"
              width={35}
              height={35}
              className="pointer-events-none select-none"
              draggable={false}
              priority
            />
          </button>

          <span className="ml-3 text-sm text-gray-700">
            {comprovante ? `Selecionado: ${comprovante}` : "Nenhum arquivo escolhido"}
          </span>
        </div>
        <div className="flex justify-end">
        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-primary text-white rounded hover:opacity-90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
        </div>
      </div>
    </form>
  );
}
