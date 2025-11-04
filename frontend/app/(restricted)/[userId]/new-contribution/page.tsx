"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/globals.css";

import MenuDesktop from "@/components/menu-desktop";
import MenuMobile from "@/components/menu-mobile";
import DonationsForm from "@/components/donations-form";
import FoodDonations from "@/components/food-donations";

type Tipo = "Financeira" | "Alimenticia";

export default function Donations() {
  const params = useParams();
  const userId = Number(
    (params as Record<string, string | string[] | undefined>)?.userId
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [raUsuario, setRaUsuario] = useState<number | undefined>(userId);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"finance" | "food">("finance");
  const [alimentosFromChild, setAlimentosFromChild] = useState<any>(null);
  const [totaisFromChild, setTotaisFromChild] = useState<{ pontos: number }>({
    pontos: 0,
  });
  const [tipoDoacao, setTipoDoacao] = useState<"Financeira" | "Alimenticia">("Alimenticia");

  interface FinanceiraState {
  tipoDoacao: Tipo;
  fonte: string;
  meta?: number;
  gastos?: number;
  quantidade?: number;
  comprovante: string;
}
  // ✅ Estados separados por tipo
  const [financeira, setFinanceira] = useState<FinanceiraState>({
    tipoDoacao: "Financeira" as Tipo,
    fonte: "",
    meta:undefined,
    gastos: undefined,
    quantidade: undefined,
    comprovante: "",
  });

  const [alimenticia, setAlimenticia] = useState({
    tipoDoacao: "Alimenticia" as Tipo,
    fonte: "",
    meta: undefined,
    quantidade: undefined,
    pesoUnidade: 0,
  });

  const fmt = (value: number) => value.toLocaleString("pt-BR");

  const apiBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";
  const apiUrl = `${apiBase}/api/new-contribution`;

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    tipo: Tipo
  ) {
    e.preventDefault();
    setLoading(true);

    try {
      const body =
        tipo === "Financeira" ? financeira : alimenticia;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Erro ao enviar (${res.status})`);

      alert(`Contribuição ${tipo.toLowerCase()} enviada com sucesso!`);

      if (tipo === "Financeira") {
        setFinanceira({
          tipoDoacao: "Financeira",
          fonte: "",
          meta:undefined,
          gastos: undefined,
          quantidade: undefined,
          comprovante: "",
        });
      } else {
        setAlimenticia({
          tipoDoacao: "Alimenticia",
          fonte: "",
          meta: undefined,
          quantidade: undefined,
          pesoUnidade: 0,
        });
      }
    } catch (err: any) {
      alert(err?.message || "Erro ao enviar a contribuição");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container w-full">
      <header className="w-full">
        <button
          className={`open-menu ${menuOpen ? "menu-icon hidden" : "menu-icon"}`}
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        <div className="sticky top-0 left-0 right-0 z-10 md:static bg-white/80 supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-4xl px-14 py-5">
            <h1 className="text-[#A6B895] tracking-tight text-center text-[32px]">
              Adicionar Contribuição
            </h1>
          </div>

          {/* Abas (mobile) */}
          <div className="md:hidden w-full flex justify-center">
            <div className="inline-grid grid-cols-2 w-full max-w-xs rounded-full border border-[#A6B895] bg-white p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("finance")}
                className={`rounded-full py-3 text-sm font-medium ${
                  activeTab === "finance"
                    ? "bg-[#A6B895] text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                Financeira
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("food")}
                className={`rounded-full py-3 text-sm font-medium ${
                  activeTab === "food"
                    ? "bg-[#A6B895] text-white"
                    : "text-[#1F2937] hover:bg-gray-100"
                }`}
              >
                Alimentos
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-container">
        <MenuDesktop
          menuOpen={menuOpen}
          raUsuario={raUsuario!}
          setMenuOpen={setMenuOpen}
        />
        <MenuMobile raUsuario={raUsuario!} />

        <main className="flex justify-center items-stretch min-h-screen w-full px-9 mt-10">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-1">
            {/* ✅ Financeiro */}
            <form
              onSubmit={(e) => handleSubmit(e, "Financeira")}
              className={`${
                activeTab === "finance" ? "block" : "hidden"
              } md:block bg-[#DCA4A9] border border-[#DCA4A9] p-6 rounded-xl shadow-md w-full h-[600px]`}
            >
              <h2 className="text-2xl font-semibold mb-4">Financeiras</h2>

              <DonationsForm
                raUsuario={raUsuario}
                setRaUsuario={setRaUsuario}
                tipoDoacao={financeira.tipoDoacao}
                setTipoDoacao={() => {}} // fixo
                fonte={financeira.fonte}
                setFonte={(v) =>
                  setFinanceira({ ...financeira, fonte: v as string })
                }
                meta={financeira.meta}
                setMeta={(v) =>
                  setFinanceira({ ...financeira, meta: Number(v) })
                }
                gastos={financeira.gastos}
                setGastos={(v) =>
                  setFinanceira({ ...financeira, gastos: Number(v) })
                }
                quantidade={financeira.quantidade}
                setQuantidade={(v) =>
                  setFinanceira({ ...financeira, quantidade: Number(v) })
                }
                comprovante={financeira.comprovante}
                setComprovante={(v) =>
                  setFinanceira({ ...financeira, comprovante: v as string })
                }
              />
              
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            onClick={() => setTipoDoacao("Financeira")}
            disabled={loading}
            className="px-10 py-2 rounded-lg bg-[#B27477] hover:bg-[#9B5B60] text-white transition disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar Financeira"}
          </button>
           </div>
            </form>

            {/* ✅ Alimentícia */}
            <form
              onSubmit={(e) => handleSubmit(e, "Alimenticia")}
              className={`${
                activeTab === "food" ? "block" : "hidden"
              } md:flex md:flex-col bg-[#F2D1D4] border border-gray-100 p-6 rounded-xl shadow-md w-full h-[600px]`}
            >
              <h2 className="text-2xl font-semibold mb-3">Alimentícias</h2>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-lg">
                <FoodDonations
                  raUsuario={raUsuario}
                  setRaUsuario={setRaUsuario}
                  tipoDoacao={alimenticia.tipoDoacao}
                  setTipoDoacao={() => {}} // fixo
                  pesoUnidade={alimenticia.pesoUnidade}
                  setPesoUnidade={(v) =>
                    setAlimenticia({ ...alimenticia, pesoUnidade: Number(v) })
                  }
                  quantidade={alimenticia.quantidade}
                  setQuantidade={(v) =>
                    setAlimenticia({ ...alimenticia, quantidade: Number(v) })
                  }
                  meta={alimenticia.meta}
                  setMeta={(v) =>
                    
                    setAlimenticia({ ...alimenticia, meta: Number(v) })
                  }
                  fonte={alimenticia.fonte}
                  setFonte={(v) =>
                    setAlimenticia({ ...alimenticia, fonte: v as string })
                  }
                  
                  onAlimentosChange={setAlimentosFromChild}
                  onTotaisChange={setTotaisFromChild}
                />
              </div>

              <div className="mt-4 flex flex-none items-center gap-3 justify-end">
                <div className="bg-[#DCA4A9] border text-sm rounded-lg py-2 px-16 whitespace-nowrap w-[300px] overflow-hidden text-ellipsis">
                  Pontuação: <span>{fmt(totaisFromChild?.pontos ?? 0)}</span>
                </div>

                <button
                  type="submit"
                  onClick={() => setTipoDoacao("Alimenticia")}
                  disabled={loading}
                  className="w-fit px-4 py-2 rounded-lg bg-emerald-600 text-white hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Cadastrar Alimentícia"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
