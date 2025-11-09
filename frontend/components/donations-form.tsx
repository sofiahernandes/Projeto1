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
  Quantidade?: number; 
  setQuantidade: React.Dispatch<React.SetStateAction<number | undefined>>;
  fonte: string;
  setFonte: React.Dispatch<React.SetStateAction<string>>;
  Meta?: number;
  setMeta: React.Dispatch<React.SetStateAction<number | undefined>>;
  Gastos?: number;
  setGastos: React.Dispatch<React.SetStateAction<number | undefined>>;
  Comprovante: File | null; 
  setComprovante: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function DonationsForm({
  raUsuario,
  setRaUsuario,
  tipoDoacao,
  setTipoDoacao,
  Quantidade,
  setQuantidade,
  fonte,
  setFonte,
  Meta,
  setMeta,
  Gastos,
  setGastos,
  Comprovante,
  setComprovante,
}: Properties) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [picking, setPicking] = useState(false);
  const timerRef = useRef<number | null>(null);

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
    timerRef.current = window.setTimeout(stopGif, 1000);
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
      setComprovante(null);
      stopGif();
      return;
    }

    const okType = ["image/png", "image/jpeg", "image/jpg", "application/pdf"].includes(
      file.type
    );
    const okSize = file.size <= 5 * 1024 * 1024;

    if (!okType) {
      alert("Formato inválido. Use PNG, JPEG ou PDF.");
      stopGif();
      return;
    }
    if (!okSize) {
      alert("Arquivo muito grande (máx. 5MB).");
      stopGif();
      return;
    }

    setComprovante(file);
    stopGif();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-xl">
        <label className="block mb-1">Nome do Evento / Doador</label>
        <input
          type="text"
          placeholder="Ex: Instituto Alma"
          value={fonte}
          onChange={(e) => setFonte(e.currentTarget.value)}
          className="w-[80%] bg-white border border-gray-300 rounded-lg px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Meta</label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex: 1000"
          value={Meta === 0 || Meta === undefined ? "" : Meta}
          onChange={(e) =>
            setMeta(e.currentTarget.value === "" ? 0 : Number(e.currentTarget.value))
          }
          className="w-[80%] bg-white border border-gray-300 rounded-lg px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Gastos</label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex: 100"
          value={Gastos === 0 || Gastos === undefined ? "" : Gastos}
          onChange={(e) =>
            setGastos(e.currentTarget.value === "" ? 0 : Number(e.currentTarget.value))
          }
          className="w-[80%] bg-white border border-gray-300 rounded-lg px-3 py-1.5"
        />

        <label className="block mb-1 mt-3">Valor R$</label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex: 140"
          value={Quantidade === 0 || Quantidade === undefined ? "" : Quantidade}
          onChange={(e) =>
            setQuantidade(
              e.currentTarget.value === "" ? 0 : Number(e.currentTarget.value)
            )
          }
          className="w-[80%] bg-white border border-gray-300 rounded-lg px-3 py-1.5"
        />

        <label className="block mb-1 mt-8">Comprovante (PNG/JPEG/JPG/PDF)</label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

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
            {Comprovante ? `Selecionado: ${Comprovante.name}` : "Nenhum arquivo escolhido"}
          </span>
        </div>
      </div>
    </div>
  );
}