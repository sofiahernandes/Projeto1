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
  const teamId = Number(params.teamId);
  const [team, setTeam] = React.useState<any>(null);
  const [user, setUser] = React.useState<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      const data = await fetchData(teamId);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [teamId]);

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
            <h3 className="text-2xl uppercase font-semibold text-primary ">
              {team?.NomeTime ? team?.NomeTime : "Nome do time aparecerá aqui"}
            </h3>
            <h4 className="mb-3 text-xl text-primary/80">
              Turma {user?.Turma ? user?.Turma : "X"} | Yº Edição
            </h4>
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
