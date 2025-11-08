"use client";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useMemo, useState, useRef } from "react";

import uploadStatic from "@/assets/icons/upload-static.png";
import uploadGif from "@/assets/icons/upload-anim.gif";

type AlimentoRow = {
  id: number;
  Nome: string;
  quantidade: string;
  pesoUnidade: string;
};

type Img = StaticImageData | string;

interface Properties {
  raUsuario: number;
  setRaUsuario: React.Dispatch<React.SetStateAction<number>>;
  tipoDoacao: "Financeira" | "Alimenticia";
  setTipoDoacao: React.Dispatch<React.SetStateAction<"Financeira" | "Alimenticia">>;
  quantidade: number;
  setQuantidade: React.Dispatch<React.SetStateAction<number>>;
  pesoUnidade: number;
  setPesoUnidade: React.Dispatch<React.SetStateAction<number>>;
  comprovante: string;
  setComprovante: React.Dispatch<React.SetStateAction<string>>;
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  meta: number;
  setMeta: React.Dispatch<React.SetStateAction<number>>;
  onAlimentosChange?: (
  alimentos: { id: number; Nome: string; quantidade: number; pesoUnidade: number }[]
) => void;
  onTotaisChange?: (totais: { kgTotal: number; pontos: number }) => void;
  idAlimento?: number;
  setIdAlimento?: React.Dispatch<React.SetStateAction<number>>;
}

export default function FoodDonations({
  raUsuario,
  setRaUsuario,
  tipoDoacao,
  setTipoDoacao,
  quantidade,
  setQuantidade,
  pesoUnidade,
  setPesoUnidade,
  fonte,
  setFonte,
  meta,
  setMeta,
  onAlimentosChange,
  onTotaisChange,
  idAlimento, 
  setIdAlimento,
  comprovante,
  setComprovante,
}: Properties) {
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [picking, setPicking] = useState(false);
  const timerRef = useRef<number | null>(null);


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
      form.append("PesoUnidade", String(pesoUnidade ?? ""));
      form.append("Meta", String(meta ?? ""));
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
      setQuantidade(0);
      setMeta(0);
      setPesoUnidade(0);
      setComprovante("");
      setComprovanteFile(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro de conexão");
    } finally {
      setLoading(false);
    }
  };


  const [alimentos, setAlimentos] = useState<AlimentoRow[]>([
    { id: 1, Nome: "Arroz Polido", quantidade: "", pesoUnidade: "" },
    { id: 2, Nome: "Feijão Preto", quantidade: "", pesoUnidade: "" },
    { id: 3, Nome: "Macarrão", quantidade: "", pesoUnidade: "" },
    { id: 4, Nome: "Fubá", quantidade: "", pesoUnidade: "" },
    { id: 5, Nome: "Leite em Pó", quantidade: "", pesoUnidade: "" },
    { id: 6, Nome: "Açúcar Refinado", quantidade: "", pesoUnidade: "" },
    { id: 7, Nome: "Óleo de Soja", quantidade: "", pesoUnidade: "" },
    { id: 8, Nome: "Outros", quantidade: "", pesoUnidade: "" },
  ]);

  // pontos por kg (exemplo)
  const PONTOS_POR_KG: Record<string, number> = {
    "Arroz Polido": 3,
    "Feijão Preto": 5,
    "Açúcar Refinado":1,
    "Leite em Pó": 3,
    "Fubá":  1.25,
    "Macarrão": 1.25,
    "Óleo de Soja": 8,
  };

  const parseNumber = (str: string | number): number => {
    if (typeof str === "number") return Number.isFinite(str) ? str : 0;
    const s = str.trim();
    if (s === "") return 0;
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const nearlyEqual = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

  const fmt2 = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // totais gerais
  const totais = useMemo(() => {
    let kgTotal = 0;
    let pontos = 0;
    for (const { Nome, quantidade, pesoUnidade } of alimentos) {
      const q = parseNumber(quantidade);
      const kgU = parseNumber(pesoUnidade);
      const kg = q * kgU;
      kgTotal += kg;
      const ptsKg = PONTOS_POR_KG[Nome] ?? 0;
      pontos += kg * ptsKg;
    }
    return { kgTotal, pontos };
  }, [alimentos]);

  // atualizar totais globais
  useEffect(() => {
    const somaQtd = alimentos.reduce((acc, a) => acc + parseNumber(a.quantidade), 0);
    const somaPeso = alimentos.reduce((acc, a) => acc + parseNumber(a.pesoUnidade), 0);
    const countPeso = alimentos.filter((a) => parseNumber(a.pesoUnidade) > 0).length;
    const mediaPeso = countPeso > 0 ? somaPeso / countPeso : 0;

    if (!nearlyEqual(somaQtd, quantidade ?? 0)) setQuantidade(somaQtd);
    if (!nearlyEqual(mediaPeso, pesoUnidade ?? 0)) setPesoUnidade(mediaPeso);
  }, [alimentos, quantidade, pesoUnidade, setQuantidade, setPesoUnidade]);

useEffect(() => {
  if (!onAlimentosChange) return;

  // Converte os valores string -> number
  const converted = alimentos.map(({ id, Nome, quantidade, pesoUnidade }) => ({
    id,
    Nome,
    quantidade: Number(quantidade) || 0,
    pesoUnidade: Number(pesoUnidade) || 0,
  }));

  onAlimentosChange(converted);
}, [alimentos, onAlimentosChange]);

  useEffect(() => {
    onTotaisChange?.(totais);
  }, [totais, onTotaisChange]);

  // atualizar alimento individual
  const handleAlimentoChange = (
    id: number,
    campo: "quantidade" | "pesoUnidade",
    valor: string
  ) => {
    const v = valor.replace(/\s+/g, "");
    // impede números decimais no campo de quantidade
    if (campo === "quantidade" && v.includes(".")) return;
    setAlimentos((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [campo]: v } : row))
    );
  };

  return (
    <form className="flex flex-col gap-2 w-full min-h-screen">
      <div>Nome do Evento</div>

      <input
        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-black"
        type="text"
        placeholder="Ex: Instituto Alma"
        value={fonte}
        onChange={(e) => setFonte(e.target.value)}
      />


  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
    {/* Coluna 1: Meta */}
    <div className="flex flex-col">
      <label className="block mb-1 text-gray-700">Meta</label>
      <input
        type="number"
        placeholder="Ex: 1200"
        value={meta === 0 ? "" : meta}
        onChange={(e) =>
          setMeta(e.currentTarget.value === "" ? 0 : Number(e.currentTarget.value))
        }
        className="h-10 w-full bg-white border border-gray-300 rounded-lg px-3"
      />
    </div>

    {/* Coluna 2: Total em Kg (readOnly, visual idêntico) */}
    <div className="flex flex-col">
      <label className="block mb-1 text-gray-700 sm:text-left">Total em Kg</label>
      <input
        type="text"
        readOnly
            value={totais.kgTotal.toLocaleString("pt-BR")}
        className="h-10 w-full bg-white border border-gray-300 rounded-lg px-3 text-center"
        aria-readonly="true"
        tabIndex={-1}
      />
    </div>
  </div>


      {/* Cabeçalho */}
      <div className="flex gap-4 font-bold">
        <div className="w-[30%] text-center">Alimento</div>
        <div className="w-[30%] text-center">Unidades</div>
        <div className="w-[30%] text-center">Kg/Unidade</div>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="flex flex-col space-y-3">
        {alimentos.map((a) => (
          <div key={a.id} className="flex gap-4 w-full">
            <div className="w-[30%] bg-white border border-gray-300 rounded-lg flex items-center justify-center text-center px-3 py-2">
              {a.Nome}
            </div>
            <input
              className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center"
              type="number"
              placeholder="Qtd"
              value={a.quantidade}
              onChange={(e) =>
                handleAlimentoChange(a.id, "quantidade", e.target.value)
              }
              inputMode="numeric"
            />
            <input
              className="w-[30%] bg-white border border-gray-300 rounded-lg px-3 py-2 text-center"
              type="number"
              step="0.01"
              placeholder="Kg"
              value={a.pesoUnidade}
              onChange={(e) =>
                handleAlimentoChange(a.id, "pesoUnidade", e.target.value)
              }
              inputMode="decimal"
            />
          </div>
        ))}
        </div>

        <label className="block mb-1 mt-8">Imagem dos Alimentos</label>

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
    </form>
  );
}
