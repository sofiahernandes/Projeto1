"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { Contribution } from "@/components/contribution-table-admin/columns";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MajorContributionsChart } from "@/components/reports-charts/tooltip-chart/page";
import { FoodDonationsChart } from "@/components/reports-charts/pie-chart-label/page";
import { FinanContribuitionsChart } from "@/components/reports-charts/area-chart/page";
import { TeamsRankingChart } from "@/components/reports-charts/bar-label-costum/page";
import { HandHeart } from "lucide-react";
import BackHome from "@/components/back-home";
import RecordsMentor from "@/components/records-mentor";
import SwitchViewButton from "@/components/toggle-button";
import RenderContributionTableAdmin from "@/components/table-contribution-admin";
import RenderContributionCardAdmin from "@/components/grid-contribution-admin";
import Loading from "@/components/loading";

// Generate editions automatically
function generateEditions(startEdition = 7, startYear = 2025) {
  const editions = [];
  const currentDate = new Date();
  const yearDiff = currentDate.getFullYear() - startYear;
  const currentEdition =
    startEdition + yearDiff * 2 + (currentDate.getMonth() >= 7 ? 1 : 0);

  for (let ed = startEdition; ed <= currentEdition + 1; ed++) {
    const baseYear = startYear + Math.floor((ed - startEdition) / 2);
    const isFirstSemester = ed % 2 === 1;
    const period = isFirstSemester
      ? `Jan - Jul ${baseYear}`
      : `Ago - Dez ${baseYear}`;
    editions.push({
      value: ed,
      label: `${ed}ª Edição (${period})`,
    });
  }
  return editions;
}

export default function PublicReports() {
  const [edition, setEdition] = useState<number>(() => {
    // auto-select the current edition
    const now = new Date();
    const startEdition = 7;
    const startYear = 2025;
    const yearDiff = now.getFullYear() - startYear;
    const currentEdition =
      startEdition + yearDiff * 2 + (now.getMonth() >= 7 ? 1 : 0);
    return currentEdition;
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editions = generateEditions();

   const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  // Fetch contributions filtered by edition
  useEffect(() => {
    async function fetchContributions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${backend_url}/api/contributions/edition/${edition}`
        );
        if (!res.ok) throw new Error("Erro ao buscar contribuições");
        const data = await res.json();
        setContributions(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, [edition]);

  if (!contributions.length) {
    return (
      <>
        <div className="absolute left-0 top-0 m-4">
          <BackHome />
        </div>
        <div className="col-start-2 border rounded-xl border-gray-200 shadow-xl w-auto max-w-[90%] md:max-w-100 mx-auto">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HandHeart size={44} strokeWidth={1.2} />
              </EmptyMedia>
              <EmptyTitle>Nenhuma contribuição por enquanto!</EmptyTitle>
              <EmptyDescription>
                Ainda não foi arrecadada nenhuma doação. Quando os alunos
                adicionarem contribuições ao Arkana, aparecerão aqui.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-background p-6">
      <div className="absolute left-0 top-0 m-4">
        <BackHome />
      </div>

      <div className="mx-auto mt-5 grid grid-cols-1 md:grid-cols-3">
        <div className="w-full h-full md:col-span-2">
          {/* Edition Selector */}
          <div className="flex justify-center mb-6">
            <select
              title="Filtrar por edição"
              value={edition}
              onChange={(e) => setEdition(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {editions.map((ed) => (
                <option key={ed.value} value={ed.value}>
                  {ed.label}
                </option>
              ))}
            </select>
          </div>

          {/* Table / Loading / Error */}
          {loading && (
            <p className="text-center text-gray-600">
              <Loading />
            </p>
          )}

          {error && (
            <p className="text-center text-red-500">
              Ocorreu um erro! Recarregue a página para tentar novamente.
            </p>
          )}

          {!loading && !error && (
            <div className="min-h-dvh w-full overflow-y-hidden overflow-x-hidden flex flex-col bg-[#f4f3f1]/60">
              <div className="flex flex-col left-0 top-0">
                <header className="py-4 mt-6 relative flex justify-center items-center">
                  <button
                    type="button"
                    className={`open-menu hover:text-primary/60 ${
                      menuOpen ? "menu-icon hidden" : "menu-icon"
                    }`}
                    onClick={() => setMenuOpen(true)}
                  >
                    {" "}
                    ☰{" "}
                  </button>
                  <h1
                    className={`text-4xl font-semibold text-[#cc3983] text-center transition-all duration-300 ease-in-out ${
                      menuOpen ? "md:pl-[270px]" : "ml-0"
                    }`}
                  >
                    Histórico de contribuições
                  </h1>
                </header>
              </div>

              <div className="*:w-full flex justify-center pt-4 transition-all duration-300 ease-in-out">
                <main className="w-full max-w-[1300px] p-1.5 md:mt-0 ">
                  {selectedContribution && (
                    <RecordsMentor
                      data={selectedContribution}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                    />
                  )}
                  <div className="flex flex-col gap-2 mx-3 text-center">
                    <h3 className="text-2xl uppercase font-semibold text-primary ">
                      Histórico de contribuições
                    </h3>
                    <div className="self-end">
                      <SwitchViewButton
                        buttonSelected={buttonSelected}
                        setButtonSelected={(arg: SetStateAction<boolean>) =>
                          setButtonSelected(arg)
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    {buttonSelected ? (
                      <RenderContributionTableAdmin
                        onSelect={(contribution: any) => {
                          setSelectedContribution(contribution);
                          setIsOpen(true);
                        }}
                      />
                    ) : (
                      <RenderContributionCardAdmin
                        onSelect={(contribution: any) => {
                          setSelectedContribution(contribution);
                          setIsOpen(true);
                        }}
                      />
                    )}
                  </div>
                </main>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-full">
          <MajorContributionsChart />
          <FoodDonationsChart />
          <FinanContribuitionsChart />
          <TeamsRankingChart />
        </div>
      </div>
    </div>
  );
}
