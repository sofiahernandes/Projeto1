"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/globals.css";
import MenuDesktop from "@/components/menu-desktop";
import MenuMobile from "@/components/menu-mobile";
import DonationsForm from "@/components/donations-form";
import FoodDonations from "@/components/food-donations";

type Tipo = "Financeira" | "Alimenticia";

export default function Donations() {
  const params = useParams();
  const [raUsuario, setRaUsuario] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"finance" | "food">("finance");
  const [alimentosFromChild, setAlimentosFromChild] = useState<any[]>([]);
  const [totaisFromChild, setTotaisFromChild] = useState<{ pontos: number }>({
    pontos: 0,
  });
  const [idAlimento, setIdAlimento] = useState<number>(0);

  useEffect(() => {
    if (params?.RaUsuario) {
      setRaUsuario(Number(params.RaUsuario));
    }
  }, [params]);

  interface FinanceiraState {
    tipoDoacao: Tipo;
    fonte: string;
    meta?: number;
    gastos?: number;
    quantidade?: number;
    comprovante: File | null;
  }

  const [financeira, setFinanceira] = useState<FinanceiraState>({
    tipoDoacao: "Financeira",
    fonte: "",
    meta: 0,
    gastos: 0,
    quantidade: 0,
    comprovante: null,
  });

  interface AlimenticiaState {
    tipoDoacao: Tipo;
    fonte: string;
    meta?: number;
    gastos?: number;
    quantidade?: number;
    pesoUnidade?: number;
    comprovante: File | null;
  }

  const [alimenticia, setAlimenticia] = useState<AlimenticiaState>({
    tipoDoacao: "Alimenticia",
    fonte: "",
    meta: 0,
    quantidade: 0,
    gastos: 0,
    pesoUnidade: 0,
    comprovante: null,
  });

  const fmt = (value: number) => value.toLocaleString("pt-BR");

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const apiUrl = `${backend_url}/api/createContribution`;

  // =========================
  // HANDLERS
  // =========================

  async function handleFinancialSubmit() {
    if (loading) return;
    setLoading(true);

    try {
      if (!raUsuario) throw new Error("RaUsuario inválido.");

      const body = {
        RaUsuario: raUsuario,
        TipoDoacao: "Financeira",
        Quantidade: financeira.quantidade,
        Meta: financeira.meta,
        Gastos: financeira.gastos,
        Fonte: financeira.fonte,
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao enviar a contribuição");
      }

      alert("Contribuição financeira enviada com sucesso!");

      setFinanceira({
        tipoDoacao: "Financeira",
        fonte: "",
        meta: 0,
        gastos: 0,
        quantidade: 0,
        comprovante: null,
      });
    } catch (err: any) {
      alert(err?.message || "Erro ao enviar a contribuição");
    } finally {
      setLoading(false);
    }
  }

  function handleAlimentoChange(alimentoAtual: {
    id: number;
    quantidade: number;
    pesoUnidade: number;
  }) {
    setAlimentosFromChild([alimentoAtual]); // mantém apenas um alimento por vez
  }

  async function handleFoodSubmit() {
    if (loading) return;
    setLoading(true);

    try {
      if (!raUsuario) throw new Error("RaUsuario inválido.");

      const alimentosParaEnviar = alimentosFromChild.filter(
        (a) => a.quantidade > 0 && a.id >= 0
      );

      if (alimentosParaEnviar.length === 0) {
        throw new Error("Adicione pelo menos um alimento com quantidade.");
      }

      const body = {
        RaUsuario: raUsuario,
        TipoDoacao: "Alimenticia",
        Quantidade: alimenticia.quantidade,
        PesoUnidade: alimenticia.pesoUnidade,
        Gastos: alimenticia.gastos ?? 0,
        Meta: alimenticia.meta,
        Fonte: alimenticia.fonte,
        alimentos: alimentosParaEnviar,
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok)
        throw new Error(`Erro ao enviar (${res.status}): ${await res.text()}`);

      alert("Contribuição alimentícia enviada com sucesso!");

      setAlimenticia({
        tipoDoacao: "Alimenticia",
        fonte: "",
        meta: 0,
        quantidade: 0,
        pesoUnidade: 0,
        gastos: 0,
        comprovante: null,
      });
      setAlimentosFromChild([]);
    } catch (err: any) {
      alert(err?.message || "Erro ao enviar a contribuição");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="container w-full">
      <header className="w-full">
        <button
          className={`open-menu ${menuOpen ? "hidden" : "menu-icon"}`}
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        <div className="sticky top-0 left-0 right-0 z-10 md:static bg-white/80 supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto text-4xl px-14 py-5">
            <h1 className="text-primary tracking-tight text-center">
              Adicionar Contribuição
            </h1>
          </div>

          <div className="md:hidden w-full flex justify-center">
            <div className="inline-grid grid-cols-2 w-full max-w-xs rounded-full border border-gray bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("finance")}
                className={`rounded-full py-3 text-sm font-medium ${
                  activeTab === "finance"
                    ? "bg-primary text-white"
                    : "text-black"
                }`}
              >
                Financeira
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("food")}
                className={`rounded-full py-3 text-sm font-medium ${
                  activeTab === "food"
                    ? "bg-primary text-white"
                    : "text-black"
                }`}
              >
                Alimentos
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-container">
        <MenuDesktop menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MenuMobile />

        <main className="flex justify-center items-stretch min-h-screen w-full px-9 mt-10">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFinancialSubmit();
              }}
              className={`${
                activeTab === "finance" ? "block" : "hidden"
              } md:block bg-secondary/20 border border-gray-100 p-6 rounded-xl shadow-md w-full h-[600px]`}
            >
              <h2 className="text-2xl font-semibold mb-4">Financeiras</h2>

              <DonationsForm
                raUsuario={raUsuario}
                setRaUsuario={setRaUsuario}
                tipoDoacao={financeira.tipoDoacao}
                setTipoDoacao={() => {}}
                fonte={financeira.fonte}
                setFonte={(v) =>
                  setFinanceira({ ...financeira, fonte: v as string })
                }
                meta={financeira.meta ?? 0}
                setMeta={(v) =>
                  setFinanceira({ ...financeira, meta: Number(v) })
                }
                gastos={financeira.gastos ?? 0}
                setGastos={(v) =>
                  setFinanceira({ ...financeira, gastos: Number(v) })
                }
                quantidade={financeira.quantidade ?? 0}
                setQuantidade={(v) =>
                  setFinanceira({ ...financeira, quantidade: Number(v) })
                }
                comprovante={financeira.comprovante}
                setComprovante={(v) =>
                  setFinanceira({
                    ...financeira,
                    comprovante: v as File | null,
                  })
                }
              />

              <div className="mt-13 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-fit px-4 py-2 rounded-[8px] bg-primary hover:bg-opacity/10 text-white hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Cadastrar"}
                </button>
              </div>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFoodSubmit();
              }}
              className={`${
                activeTab === "food" ? "block" : "hidden"
              } md:flex md:flex-col bg-secondary/20 border border-gray-100 p-6 rounded-xl shadow-md w-full h-[600px] overflow-y-scroll`}
            >
              <h2 className="text-2xl font-semibold mb-3">Alimentícias</h2>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-lg">
                <FoodDonations
                  raUsuario={raUsuario}
                  setRaUsuario={setRaUsuario}
                  tipoDoacao={alimenticia.tipoDoacao}
                  setTipoDoacao={() => {}}
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
                  comprovante={alimenticia.comprovante}
                  setComprovante={(v) =>
                    setAlimenticia({
                      ...alimenticia,
                      comprovante: v as File | null,
                    })
                  }
                  onTotaisChange={setTotaisFromChild}
                  idAlimento={idAlimento}
                  setIdAlimento={setIdAlimento}
                  onAlimentoChange={handleAlimentoChange}
                  gastos={alimenticia.gastos ?? 0}
                  setGastos={(v) =>
                    setAlimenticia({ ...alimenticia, gastos: Number(v) })
                  }
                />
              </div>

              <div className="mt-4 flex flex-none items-center gap-3 justify-end">
                <div className="bg-secondary/50 text-sm rounded-lg py-2 px-16 whitespace-nowrap w-[300px] overflow-hidden text-ellipsis">
                  Pontuação: <span>{fmt(totaisFromChild?.pontos ?? 0)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-fit px-4 py-2 rounded-lg bg-primary text-white hover:bg-[#195b41] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
