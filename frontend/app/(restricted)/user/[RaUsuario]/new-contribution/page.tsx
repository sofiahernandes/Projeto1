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
  const params = useParams() as { RaUsuario?: string };
  const raUsuario = Number(params?.RaUsuario ?? 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"finance" | "food">("finance");

const [alimentosFromChild, setAlimentosFromChild] = useState<
  { id: number; Nome: string; quantidade: number; pesoUnidade: number }[]
>([]);

  const [totaisFromChild, setTotaisFromChild] = useState<{ pontos: number }>({
    pontos: 0,
  });

  const [tipoDoacao, setTipoDoacao] = useState<Tipo>("Alimenticia");
  const [idAlimento, setIdAlimento] = useState<number>(0);

  // ===== ESTADOS =====

  interface FinanceiraState {
    tipoDoacao: Tipo;
    fonte: string;
    meta: number;
    gastos: number;
    quantidade: number;
    comprovante: string;
  }

  const [financeira, setFinanceira] = useState<FinanceiraState>({
    tipoDoacao: "Financeira",
    fonte: "",
    meta: 0,
    gastos: 0,
    quantidade: 0,
    comprovante: "",
  });

  interface AlimenticiaState {
    tipoDoacao: Tipo;
    fonte: string;
    meta: number;
    quantidade: number;
    pesoUnidade: number;
    comprovante: string;
  }

  const [alimenticia, setAlimenticia] = useState<AlimenticiaState>({
    tipoDoacao: "Alimenticia",
    fonte: "",
    meta: 0,
    quantidade: 0,
    pesoUnidade: 0,
    comprovante: "",
  });

  // ===== FUNÇÕES =====

  const fmt = (value: number) => value.toLocaleString("pt-BR");

  const apiBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ||
    "http://localhost:3001";
  const apiUrl = `${apiBase}/api/createContribution`;

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    tipo: Tipo
  ) {
    e.preventDefault();
    setLoading(true);

    try {
      let body: any;

      if (tipo === "Financeira") {
        if (!financeira.fonte.trim()) {
          alert("Preencha o campo de fonte.");
          setLoading(false);
          return;
        }

        body = {
          TipoDoacao: "Financeira",
          RaUsuario: raUsuario,
          Quantidade: financeira.quantidade,
          Gastos: financeira.gastos,
          Fonte: financeira.fonte,
          Comprovante: financeira.comprovante || "sem-comprovante",
          Meta: financeira.meta,
        };
      } else {
        if (alimentosFromChild.length === 0) {
          alert("Adicione pelo menos um alimento antes de enviar.");
          setLoading(false);
          return;
        }

        body = {
          TipoDoacao: "Alimenticia",
          RaUsuario: raUsuario,
          Fonte: alimenticia.fonte,
          Comprovante: alimenticia.comprovante || "sem-comprovante",
          Meta: alimenticia.meta,
          Alimentos: alimentosFromChild.map((a) => ({
            IdAlimento: a.id,
            Quantidade: a.quantidade,
            PesoUnidade: a.pesoUnidade,
          })),
        };
      }

      console.log("📤 Enviando dados:", body);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok)
        throw new Error(`Erro ao enviar (${res.status}): ${await res.text()}`);

      alert(`Contribuição ${tipo.toLowerCase()} enviada com sucesso!`);

      if (tipo === "Financeira") {
        setFinanceira({
          tipoDoacao: "Financeira",
          fonte: "",
          meta: 0,
          gastos: 0,
          quantidade: 0,
          comprovante: "",
        });
      } else {
        setAlimenticia({
          tipoDoacao: "Alimenticia",
          fonte: "",
          meta: 0,
          quantidade: 0,
          pesoUnidade: 0,
          comprovante: "",
        });
        setAlimentosFromChild([]);
      }
    } catch (err: any) {
      console.error("❌ Erro ao enviar:", err);
      alert(err?.message || "Erro ao enviar contribuição");
    } finally {
      setLoading(false);
    }
  }

  // ===== RENDER =====

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
          <div className="mx-auto max-w-4xl px-14 py-5">
            <h1 className="text-primary tracking-tight text-center text-[32px]">
              Adicionar Contribuição
            </h1>
          </div>

          {/* Abas (mobile) */}
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
                  activeTab === "food" ? "bg-primary text-white" : "text-black"
                }`}
              >
                Alimentos
              </button>
            </div>
          </div>
        </div>
      </header>

      <div>
        <MenuDesktop
          menuOpen={menuOpen}
          RaUsuario={raUsuario}
          setMenuOpen={setMenuOpen}
        />
        <MenuMobile RaUsuario={raUsuario} />

        <main className="flex justify-center items-stretch min-h-screen w-full px-9 mt-10">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-1">
            {/* FORM FINANCEIRO */}
            <form
              onSubmit={(e) => handleSubmit(e, "Financeira")}
              className={`${
                activeTab === "finance" ? "block" : "hidden"
              } md:block bg-secondary/20 border border-gray-100 p-6 rounded-xl shadow-md w-full h-[600px]`}
            >
              <h2 className="text-2xl font-semibold mb-4">Financeiras</h2>

              <DonationsForm
                raUsuario={raUsuario}
                setRaUsuario={() => {}}
                tipoDoacao={financeira.tipoDoacao}
                setTipoDoacao={() => {}}
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

              <div className="mt-4 flex items-center gap-3 justify-end">
                <button
                  type="submit"
                  onClick={() => setTipoDoacao("Financeira")}
                  disabled={loading}
                  className="w-fit px-4 py-2 rounded-[8px] bg-primary hover:bg-primary/70 text-white hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Cadastrar"}
                </button>
              </div>
            </form>

            {/* FORM ALIMENTÍCIO */}
            <form
              onSubmit={(e) => handleSubmit(e, "Alimenticia")}
              className={`${
                activeTab === "food" ? "block" : "hidden"
              } md:flex md:flex-col bg-secondary/20 border border-gray-100 p-6 rounded-xl shadow-md w-full h-[600px] overflow-hidden`}
            >
              <h2 className="text-2xl font-semibold mb-3">Alimentícias</h2>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <FoodDonations
                  raUsuario={raUsuario}
                  setRaUsuario={() => {}}
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
                    setAlimenticia({ ...alimenticia, comprovante: v as string })
                  }
                  onTotaisChange={setTotaisFromChild}
                  idAlimento={idAlimento ?? 0}
                  setIdAlimento={setIdAlimento}
                  onAlimentosChange={setAlimentosFromChild}
                />
              </div>

              <div className="mt-4 flex items-center gap-3 justify-end">
                <div className="bg-secondary/30 text-sm rounded-[20px] py-2 px-16 whitespace-nowrap w-[300px] overflow-hidden text-ellipsis">
                  Pontuação: <span>{fmt(totaisFromChild?.pontos ?? 0)}</span>
                </div>

                <button
                  type="submit"
                  onClick={() => setTipoDoacao("Alimenticia")}
                  disabled={loading}
                  className="w-fit px-4 py-2 rounded-[8px] bg-primary hover:bg-primary/70 text-white hover:opacity-90 disabled:opacity-50"
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
