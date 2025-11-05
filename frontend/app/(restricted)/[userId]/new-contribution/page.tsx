"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/globals.css";
import MenuDesktop from "@/components/ui/MenuDesktop";
import MenuMobile from "@/components/MenuMobile";
import DonationsForm from "@/components/DonationsForm";
import FoodDonations from "@/components/FoodDonations";

type Tipo = "Financeira" | "Alimenticia";

export default function Donations() {
  const params = useParams();
  const userId = Number((params as Record<string, string | string[] | undefined>)?.userId);

  
  const [tipoDoacao, setTipoDoacao] = useState<Tipo | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [raUsuario, setRaUsuario] = useState<number | undefined>(userId);
  const [quantidade, setQuantidade] = useState<number | undefined>(undefined);
  const [meta, setMeta] = useState<number | undefined>(undefined);
  const [gastos, setGastos] = useState<number | undefined>(undefined);
  const [comprovante, setComprovante] = useState<string | null>(null); // ✅ aceita null
  const [fonte, setFonte] = useState<string | null>(null); // ✅ aceita null
  const [pesoUnidade, setPesoUnidade] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);


  const [activeTab, setActiveTab] = useState<'finance' | 'food'>('finance');
  const [alimentosFromChild, setAlimentosFromChild] = useState<any>(null);
  const [totaisFromChild, setTotaisFromChild] = useState<any>({ pontos: 0 });

  function fmt(value: number) {
    return value.toLocaleString("pt-BR");
  }

  const apiBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:3001";
  const apiUrl = `${apiBase}/api/new-contribution`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tipoDoacao) {
      alert("Escolha o tipo: Financeira ou Alimentícia.");
      return;
    }
    if (!fonte?.trim()) {
      alert("Informe o nome do evento/doador.");
      return;
    }
    if (quantidade === undefined) {
      alert("Informe a quantidade/valor.");
      return;
    }

    setLoading(true);
    try {
      const body =
        tipoDoacao === "Financeira"
          ? {
              TipoDoacao: "Financeira",
              Fonte: fonte,
              Comprovante: comprovante,
              Meta: meta,
              Quantidade: quantidade,
              Gastos: gastos,
            }
          : {
              TipoDoacao: "Alimenticia",
              Fonte: fonte,
              Quantidade: quantidade,
              PesoUnidade: pesoUnidade,
              Meta: meta,
            };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Falha (${res.status})`);
      }

      const data = await res.json();
      console.log("OK:", data);
      alert(`Contribuição ${tipoDoacao.toLowerCase()} enviada!`);

      // ✅ reset coerente
      setQuantidade(undefined);
      setFonte(null);
      setTipoDoacao(undefined);
      setMeta(undefined);
      setGastos(undefined);
      setPesoUnidade(undefined);
      setComprovante(null);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Erro ao enviar.");
    } finally {
      setLoading(false);
    }
  }

  const isFinanceira = tipoDoacao === "Financeira";
  const isAlimenticia = tipoDoacao === "Alimenticia";

  return (
    <div className="container w-full">
      <header className="w-full">
        <button
          className={`open-menu ${menuOpen ? "menu-icon hidden" : "menu-icon"}`}
          onClick={() => setMenuOpen(true)}
        >
          ☰
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
                onClick={() => setActiveTab("finance")}
                className={
                  "rounded-full py-3 text-sm font-medium transition-all " +
                  (activeTab === "finance"
                    ? "bg-[#A6B895] text-white shadow-sm"
                    : "text-black hover:bg-gray-100")
                }
              >
                Financeira
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("food")}
                className={
                  "rounded-full py-3 text-sm font-medium transition-all " +
                  (activeTab === "food"
                    ? "bg-[#A6B895] text-white shadow-sm"
                    : "text-[#1F2937] hover:bg-gray-100")
                }
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
            raUsuario={raUsuario!}
            setMenuOpen={setMenuOpen}
          />

          {/* Menu rodapé mobile */}
          <MenuMobile raUsuario={raUsuario!} />

          <main className="flex justify-center items-stretch min-h-screen w-full px-9 mt-10">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-1"
            >
              {/* Aba Financeira */}
              <div
                className={
                  (activeTab === "finance" ? "block" : "hidden") +
                  " md:block bg-[#DCA4A9] border border-[#DCA4A9] p-6 rounded-xl shadow-md w-full h-[600px]"
                }
              >
                <h2 className="text-2xl font-semibold mb-4">Financeiras</h2>

                <DonationsForm
                  tipoDoacao={tipoDoacao}
                  setTipoDoacao={setTipoDoacao}
                  fonte={fonte ?? ""}
                  setFonte={setFonte}
                  meta={meta ?? 0}
                  setMeta={setMeta}
                  gastos={gastos ?? 0}
                  setGastos={setGastos}
                  quantidade={quantidade ?? 0}
                  setQuantidade={setQuantidade}
                  comprovante={comprovante ?? ""}
                  setComprovante={setComprovante}
                />
              </div>

              {/* Aba Alimentícia */}
              <div
                className={
                  (activeTab === "food" ? "block" : "hidden") +
                  " md:flex md:flex-col bg-[#F2D1D4] border border-gray-100 p-6 rounded-xl shadow-md w-full h-[600px]"
                }
              >
                <h2 className="text-2xl font-semibold mb-3">Alimentícias</h2>

                <div className="min-h-0 flex-1">
                  <div className="overflow-x-hidden no-scrollbar md:h-full md:overflow-y-auto h-[380px] overflow-y-auto rounded-lg">
                    <FoodDonations
                      raUsuario={raUsuario}
                      setRaUsuario={setRaUsuario}
                      tipoDoacao={tipoDoacao}
                      setTipoDoacao={setTipoDoacao}
                      pesoUnidade={pesoUnidade ?? 0}
                      setPesoUnidade={setPesoUnidade}
                      quantidade={quantidade ?? 0}
                      setQuantidade={setQuantidade}
                      meta={meta ?? 0}
                      setMeta={setMeta}
                      fonte={fonte ?? ""}
                      setFonte={setFonte}
                      onAlimentosChange={setAlimentosFromChild}
                      onTotaisChange={setTotaisFromChild}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 justify-end">
                  <div className="bg-[#DCA4A9] border border-transparent text-sm rounded-lg py-2 px-16">
                    Pontuação:{" "}
                    <span>{fmt(totaisFromChild.pontos)}</span>
                  </div>

                  <button
                    type="submit"
                    onClick={() => setTipoDoacao("Alimenticia")}
                    disabled={loading}
                    className={`w-fit px-4 py-2 rounded-lg border ${
                      isAlimenticia
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-emerald-700 border-emerald-600"
                    } hover:opacity-90 disabled:opacity-50`}
                  >
                    {loading && isAlimenticia
                      ? "Enviando..."
                      : "Cadastrar Alimentícia"}
                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
