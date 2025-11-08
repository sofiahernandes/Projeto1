"use client";

import React, { useRef, useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

import uploadStatic from "@/assets/icons/upload-static.png";
import uploadGif from "@/assets/icons/upload-anim.gif";

type Img = StaticImageData | string;

interface Properties {
  raUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number>>;
  tipoDoacao: "Financeira" | "Alimenticia";
  setTipoDoacao: React.Dispatch<React.SetStateAction<"Financeira" | "Alimenticia">>;

  // ⬇️ O PAI CONTINUA USANDO number (ou 0). Não usamos undefined aqui.
  quantidade: number;
  setQuantidade: React.Dispatch<React.SetStateAction<number>>;
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  meta: number;
  setMeta: React.Dispatch<React.SetStateAction<number>>;
  gastos: number;
  setGastos: React.Dispatch<React.SetStateAction<number>>;

  comprovante: string;
  setComprovante: React.Dispatch<React.SetStateAction<string>>;
  setTipoDoacao: React.Dispatch<
    React.SetStateAction<"Financeira" | "Alimenticia">
  >;
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

  // 🔤 Estados **locais** em string para inputs numéricos
  const [metaInput, setMetaInput] = useState<string>("");
  const [gastosInput, setGastosInput] = useState<string>("");
  const [quantidadeInput, setQuantidadeInput] = useState<string>("");

  // 🧠 Funções utilitárias
  const normalize = (s: string) => s.replace(",", ".").trim();
  const toNumberOrNaN = (s: string) => Number(normalize(s));

  // 👉 Inicializa os inputs a partir das props
  useEffect(() => {
    // Regras: se o pai vier com 0, exibimos vazio "" (não mostra 0 na UI)
    setMetaInput(meta ? String(meta) : "");
    setGastosInput(gastos ? String(gastos) : "");
    setQuantidadeInput(quantidade ? String(quantidade) : "");
  }, [meta, gastos, quantidade]);

  // CSS da animação "pop" (pode mover para global)
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pop { 0% { transform: scale(1); } 40% { transform: scale(1.12); } 100% { transform: scale(1); } }
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
  const toNum = (v: string) => (v === "" ? 0 : Number(v));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;

    if (!file) {
      setComprovanteFile(null);
      setComprovante("");
      stopGif();
      return;
    }

    const okType = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
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

    // ✅ Conversões apenas aqui
    const qNum = toNumberOrNaN(quantidadeInput);
    if (!quantidadeInput || Number.isNaN(qNum)) {
      return alert("Informe um valor/quantidade válido");
    }

    const metaNum = metaInput ? toNumberOrNaN(metaInput) : NaN;
    const gastosNum = gastosInput ? toNumberOrNaN(gastosInput) : NaN;

    // Se sua regra exigir números válidos, valide:
    if (metaInput && Number.isNaN(metaNum)) return alert("Meta inválida");
    if (gastosInput && Number.isNaN(gastosNum)) return alert("Gastos inválidos");

    // Opcional: regras de negócio
    if (!Number.isNaN(metaNum) && !Number.isNaN(gastosNum) && metaNum < gastosNum) {
      const ok = confirm("Gastos maiores que a meta. Deseja continuar?");
      if (!ok) return;
    }

    // Sincroniza com o pai (se o time quiser manter números coerentes no estado global)
    setQuantidade(qNum);
    setMeta(Number.isNaN(metaNum) ? 0 : metaNum);
    setGastos(Number.isNaN(gastosNum) ? 0 : gastosNum);

    setLoading(true);
    try {
      const form = new FormData();
      if (comprovanteFile) form.append("Comprovante", comprovanteFile);
      form.append("RaUsuario", String(raUsuario));
      form.append("Quantidade", String(qNum));
      // Se enviar vazio quando não preenchido:
      form.append("Meta", metaInput ? String(metaNum) : "");
      form.append("Gastos", gastosInput ? String(gastosNum) : "");
      form.append("Fonte", fonte);
      form.append("TipoDoacao", tipoDoacao);

      const res = await fetch("/api/createContribution", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Contribuição registrada com sucesso!");

      // Reset: pai volta para 0 (conforme preferência do time)
      setFonte("");
      setQuantidade(0);
      setMeta(0);
      setGastos(0);
      setComprovante("");
      setComprovanteFile(null);

      // UI limpa (inputs mostrando placeholder)
      setQuantidadeInput("");
      setMetaInput("");
      setGastosInput("");
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

        <label className="block mb-1 mt-3">Meta</label>
        <input
          type="text"                  // ← usamos text para não forçar 0 e permitir ","
          inputMode="decimal"          // ← teclado numérico no mobile
          placeholder="Ex: R$100"
          value={metaInput}
          onChange={(e) => setMetaInput(e.currentTarget.value)}
          className="w-[80%] bg-white border border-gray-300 rounded px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Gastos</label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Ex: R$100"
          value={gastosInput}
          onChange={(e) => setGastosInput(e.currentTarget.value)}
          className="w-[80%] bg-white border border-gray-300 rounded px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Valor R$</label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Ex: R$140"
          value={quantidadeInput}
          onChange={(e) => setQuantidadeInput(e.currentTarget.value)}
          className="w-[80%] bg-white border border-gray-300 rounded px-3 py-1.5"
          required
        />

        <label className="block mb-1 mt-8">Comprovante (PNG/JPEG)</label>

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
      </div>
    </div>
  );
}