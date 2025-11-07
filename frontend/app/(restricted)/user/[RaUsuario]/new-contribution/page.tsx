"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import "@/styles/globals.css";

import MenuDesktop from "@/components/menu-desktop";
import MenuMobile from "@/components/menu-mobile";
import DonationsForm from "@/components/donations-form";
import FoodDonations from "@/components/food-donations";

type Tipo = "Financeira" | "Alimenticia";

export default function Donations() {
  

const params = useParams() as { RaUsuario?: string };
const userId = Number(params?.RaUsuario ?? "");
const raUsuario = Number.isFinite(userId) ? userId : undefined;

if (raUsuario === undefined) {
  // Mostra um esqueleto ou um fallback rápido
  return <div className="p-4">Carregando usuário…</div>;
}



  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"finance" | "food">("finance");
  const [alimentosFromChild, setAlimentosFromChild] = useState<
    { id: number; quantidade: number; pesoUnidade: number }[]
  >([]);

  const [totaisFromChild, setTotaisFromChild] = useState<{ pontos: number }>({
    pontos: 0,
  });

  const [tipoDoacao, setTipoDoacao] = useState<Tipo>("Alimenticia");
  const [idAlimento, setIdAlimento] = useState<number | undefined>();

  interface FinanceiraState {
    tipoDoacao: Tipo;
    fonte: string;
    meta?: number;
    gastos?: number;
    quantidade?: number;
    comprovante: string;
  }

  const [financeira, setFinanceira] = useState<FinanceiraState>({
    tipoDoacao: "Financeira",
    fonte: "",
    meta: undefined,
    gastos: undefined,
    quantidade: undefined,
    comprovante: "",
  });

  interface AlimenticiaState {
    tipoDoacao: Tipo;
    fonte: string;
    meta?: number;
    gastos?: number;
    quantidade?: number;
    pesoUnidade?: number;
  }

  const [alimenticia, setAlimenticia] = useState<AlimenticiaState>({
    tipoDoacao: "Alimenticia",
    fonte: "",
    meta: undefined,
    quantidade: undefined,
    pesoUnidade: 0,
  });

  const fmt = (value: number) => value.toLocaleString("pt-BR");

  const apiBase =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ||
    "http://localhost:3001";

  const apiUrl = `${apiBase}/api/createContribution`;

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    tipo: "Financeira" | "Alimenticia"
  ) {
    e.preventDefault();
    setLoading(true);

    try {
      let body: any;

      if (tipo === "Financeira") {
        body = {
          TipoDoacao: "Financeira",
          RaUsuario: raUsuario,
          Quantidade: 1,
          Gastos: financeira.gastos ?? 0,
          Fonte: financeira.fonte,
          Comprovante: "sem-comprovante",
          Meta: financeira.meta ?? 0,
        };
      } else {
        // ✅ Alimentícia com lista de alimentos
        body = {
          TipoDoacao: "Alimenticia",
          RaUsuario: raUsuario,
          Fonte: alimenticia.fonte,
          Comprovante: "sem-comprovante",
          Meta: alimenticia.meta ?? 0,
          Alimentos: alimentosFromChild.map((a) => ({
            IdAlimento: a.id,
            Quantidade: Number(a.quantidade) || 0,
            PesoUnidade: Number(a.pesoUnidade) || 0,
          })),
        };
      }

      console.log("🛰️ Enviando body para o backend:", body);

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
          meta: undefined,
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
        setAlimentosFromChild([]);
      }
    } catch (err: any) {
      console.error("Erro ao enviar:", err);
      alert(err?.message || "Erro ao enviar contribuição");
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

      <div className="">
        <MenuDesktop
          menuOpen={menuOpen}
          raUsuario={raUsuario!}
          setMenuOpen={setMenuOpen}
        />
        <MenuMobile raUsuario={raUsuario!} />

        <main className="flex justify-center items-stretch min-h-screen w-full px-9 mt-10">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-1">
            {/* ✅ Financeira */}
            <form
              onSubmit={(e) => handleSubmit(e, "Financeira")}
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
            </form>

            {/* ✅ Alimentícia */}
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
                  onTotaisChange={setTotaisFromChild}
                  idAlimento={idAlimento}
                  setIdAlimento={setIdAlimento}
                />
              </div>

              <div className="mt-4 flex flex-none items-center gap-3 justify-end">
                <div className="bg-secondary/30 text-sm rounded-lg py-2 px-16 whitespace-nowrap w-[300px] overflow-hidden text-ellipsis">
                  Pontuação: <span>{fmt(totaisFromChild?.pontos ?? 0)}</span>
                </div>

                <button
                  type="submit"
                  onClick={() => setTipoDoacao("Alimenticia")}
                  disabled={loading}
                  className="w-fit px-4 py-2 rounded-lg bg-primary hover:bg-primary/70 text-white hover:opacity-90 disabled:opacity-50"
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
