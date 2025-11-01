"use client";

import React, { SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";
import RenderContributionCard from "@/components/grid-contribution";
import { fetchData } from "@/hooks/fetch-user-profile";
import RecordsModal from "@/components/records-modal";
import SwitchViewButton from "@/components/toggle-button";
import RenderContributionTable from "@/components/table-contribution";

export default function MentorVision() {
  const params = useParams();
  const admin = Number(params.teamId);
  const [history, setHistory] = React.useState<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);

  useEffect(() => {
    const fetchTeamsData = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        console.error("NEXT_PUBLIC_BACKEND_URL não está configurada");
        alert("Erro de configuração. Entre em contato com o suporte.");
        return;
      }

      const historyApiUrl = `${backendUrl}/api/contributions`;

      try {
        const res = await fetch(historyApiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ error: "Erro desconhecido" }));
          console.error("Erro da API:", err);
          alert("Erro: " + (err.error || `Status ${res.status}`));
          return;
        }

        const History = await res.json();

        return { History };
      } catch (error) {
        console.error("Erro ao encontrar usuário:", error);

        if (error instanceof TypeError && error.message === "Failed to fetch") {
          alert(
            "Erro de conexão. Verifique se o backend está rodando e se a URL está correta."
          );
        } else {
          alert("Erro ao encontrar usuário: " + error);
        }
      }
      const data = await fetchData(admin);
      setHistory(data);
    };
    fetchTeamsData();
  }, [admin]);

  return (
    <div className="min-h-dvh w-full overflow-y-hidden overflow-x-hidden flex flex-col bg-[#f4f3f1]/60">
      <div className="flex flex-col left-0 top-0">
        <header className="py-4 mt-6 relative flex justify-center items-center">
          <h1
            className={`text-4xl font-semibold text-[#cc3983] text-center transition-all duration-300 ease-in-out`}
          >
            Histórico de contribuições
          </h1>
        </header>
      </div>

      <div
        className={`w-full flex justify-center pt-4 transition-all duration-300 ease-in-out`}
      >
        <main className="w-full max-w-[1300px] p-1.5 md:mt-0 ">
          {selectedContribution && (
            <RecordsModal
              data={selectedContribution}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            /> // Mudar para RecordsMentor!!!!!!!!!
          )}
          <div className="flex flex-col gap-2 mx-3 text-center">
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
              <RenderContributionTable
                refreshKey={refreshKey}
                onSelect={(contribution: any) => {
                  setSelectedContribution(contribution);
                  setIsOpen(true);
                }}
              />
            ) : (
              <RenderContributionCard
                refreshKey={refreshKey}
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
  );
}
