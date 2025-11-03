"use client";

import { SetStateAction, useState } from "react";
import MenuDesktop from "@/components/menu-desktop";
import MenuMobile from "@/components/menu-mobile";
import DonationsForm from "@/components/donations-form";
import FoodDonations from "@/components/food-donations";
import BackHome from "@/components/back-home";
import { useParams } from "next/navigation";
import "@/styles/globals.css";

type Alimento = { nome: string; Unidade: string; Kg: string };

export default function Donations() {
  const params = useParams();
  const userId = Number(params.userId);
  const [activeTab, setActiveTab] = useState<'finance' | 'food'>('finance');

  const [tipoDoacao, setTipoDoacao] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [raUsuario, setRaUsuario] = useState<number | undefined>(userId);
  const [quantidade, setQuantidade] = useState<number | undefined>(undefined);
  const [meta, setMeta] = useState<number | undefined>(undefined);
  const [gastos, setGastos] = useState<number | undefined>(undefined);
  const [comprovante, setComprovante] = useState("");
  const [fonte, setFonte] = useState("");
  const [pesoUnidade, setPesoUnidade] = useState<number | undefined>(undefined);
  const [alimentosFromChild, setAlimentosFromChild] = useState<Alimento[]>([]);
  const [totaisFromChild, setTotaisFromChild] = useState<{ kgTotal: number; pontos: number }>({ kgTotal: 0, pontos: 0 });
  const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

  return (
    <div className="container w-full">

      {/* HEADER: sticky no mobile; estático no md+ */}
      <header className="w-full">
        <button
          className={`open-menu ${menuOpen ? "menu-icon hidden" : "menu-icon"}`}
          onClick={() => setMenuOpen(true)}
        >
          {" "}
          ☰{" "}
        </button>

  <div className="sticky top-0 left-0 right-0 z-10 md:z-10 md:static md:bg-transparent bg-white/80 supports-[backdrop-filter]:bg-white/60">
    <div className="mx-auto max-w-4xl px-14 py-5">
      <div className="mx-auto max-w-4xl md:max-w-6xl px-4 md:px-10 py-3 md:py-6">
        <h1 className="text-[#A6B895] tracking-tight leading-[0.95] text-center text-[32px]">
          Adicionar Contribuição
        </h1>
      </div>
    </div>

    {/* Seletor de abas (mobile) */}
    <div className="md:hidden w-full flex justify-center">
      <div className="inline-grid grid-cols-2 w-full max-w-xs rounded-full border border-[#A6B895] bg-white p-0.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('finance')}
          className={
            "rounded-full py-3 text-sm font-medium transition-all " +
            (activeTab === 'finance'
              ? "bg-[#A6B895] text-white shadow-sm"
              : "text-black hover:bg-gray-100")
          }
          aria-pressed={activeTab === 'finance'}
        >
          Financeira
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('food')}
          className={
            "rounded-full py-3 text-sm font-medium transition-all " +
            (activeTab === 'food'
              ? "bg-[#A6B895] text-white shadow-sm"
              : "text-[#1F2937] hover:bg-gray-100")
          }
          aria-pressed={activeTab === 'food'}
        >
          Alimentos
        </button>
      </div>
    </div>
  </div>
</header>

<div className="content">
  <div className={`page-container ${menuOpen ? "shifted" : ""}`}>
    {/* Menu lateral desktop/tablet */}
    <MenuDesktop
       menuOpen={menuOpen}
       RaUsuario={raUsuario!}
       setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
    />

    {/* Menu rodapé mobile */}
    <MenuMobile RaUsuario={userId!} />


    <main className="flex justify-center md:justify-center items-stretch content-start min-h-screen w-full px-9 md: mt-10"> 
       <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-1">
        <div
          className={
            (activeTab === 'finance' ? "block" : "hidden") + 
            " md:block " +                                   
            " bg-[#DCA4A9] border border-[#DCA4A9] p-6 rounded-xl shadow-md " +
            " w-full h-[600px] md:h-[600px] max-w-6xl"
          }
        >
          <h2 className="text-2xl font-semibold mb-4">
          Financeiras
          </h2>

          <DonationsForm
            tipoDoacao={tipoDoacao}
            setTipoDoacao={setTipoDoacao}
            fonte={fonte}
            setFonte={setFonte}
            meta={meta ?? 0}
            setMeta={setMeta}
            gastos={gastos ?? 0}
            setGastos={setGastos}
            quantidade={quantidade ?? 0}
            setQuantidade={setQuantidade}
            comprovante={comprovante}
            setComprovante={setComprovante}
          />
        </div>

        <div
          className={
            (activeTab === 'food' ? "block" : "hidden") +  
            " md:flex md:flex-col " +                     
            " bg-[#F2D1D4] border border-gray-100 p-6 rounded-xl shadow-md " +
            " w-full h-[600px] md:h-[600px]"
          }
        >
          <h2 className="text-2xl font-semibold mb-3">
            Alimentícias
          </h2>

 
          <div className="min-h-0 flex-1 md:flex-1">
            <div className="overflow-x-hidden no-scrollbar md:h-full md:overflow-y-auto h-[380px] overflow-y-auto rounded-lg">
              <FoodDonations
                RaUsuario={raUsuario}
                setRaUsuario={setRaUsuario}
                tipoDoacao={tipoDoacao}
                setTipoDoacao={setTipoDoacao}
                pesoUnidade={pesoUnidade ?? 0}
                setPesoUnidade={setPesoUnidade}
                quantidade={quantidade ?? 0}
                setQuantidade={setQuantidade} 
                meta={meta}
                setMeta={setMeta}
                fonte={fonte}
                setFonte={setFonte}
                onAlimentosChange={setAlimentosFromChild}
                onTotaisChange={setTotaisFromChild}
              />
            </div>
          </div>
          
                <div className="mt-4 flex items-center gap-3 justify-end">
                  <div className="bg-[#DCA4A9] border border-transparent text-sm rounded-lg py-2 px-16">
                    Pontuação:{" "}
                    <span className="">{fmt(totaisFromChild.pontos)}</span>
                  </div>

                  <button
                    type="button"
                    className="bg-[#CB9499] text-white rounded-lg py-2 px-10 hover:bg-[#354F52]"
                    onClick={() => {}}
                  >
                    Cadastrar
                  </button>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
