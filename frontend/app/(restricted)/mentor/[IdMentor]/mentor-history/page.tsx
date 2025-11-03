"use client";

import React, { SetStateAction, useEffect } from "react";
import BackHome from "@/components/back-home";
import { useParams } from "next/navigation";
import { fetchData } from "@/hooks/fetch-user-profile";
import RecordsMentor from "@/components/records-mentor";
import RenderContributionCard from "@/components/grid-contribution";
import SwitchViewButton from "@/components/toggle-button";
import RenderContributionTable from "@/components/table-contribution";

export default function MentorVision() {
  const params = useParams();
  const userId = parseInt(params.RaUsuario as string, 10);
  const teamId = parseInt(params.teamId as string, 10);
  const [team, setTeam] = React.useState<any>(null);
  const [user, setUser] = React.useState<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);

  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);

  useEffect(() => {
    if (isNaN(userId) || isNaN(teamId)) {
      console.error("Parâmetros inválidos:", params);
      return;
    }

    const fetchTeamData = async () => {
      const data = await fetchData(userId);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [userId, teamId]);

  return (
    <div className="min-h-dvh w-full overflow-y-hidden overflow-x-hidden flex flex-col bg-[#f4f3f1]/60">
      <div className="flex flex-col left-0 top-0">
        <div className="absolute left-0 top-0">
          <BackHome />
        </div>
        <header className="py-4 mt-6 relative flex justify-center items-center">
          <h1 className="text-4xl font-semibold text-[#cc3983] text-center">
            Histórico de contribuições
          </h1>
        </header>
      </div>

      <div
        className={`w-full flex justify-center pt-4 transition-all duration-300 ease-in-out`}
      >
        <main className="w-full self-center max-w-[1300px] p-1.5 md:mt-0 ">
          {selectedContribution && (
            <RecordsMentor
              data={selectedContribution}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
          <div className="flex flex-col gap-2 mx-3 text-center">
            <h3 className="text-2xl uppercase font-semibold text-primary ">
              {team?.NomeTime ? team?.NomeTime : "Nome do time aparecerá aqui"}
            </h3>
            <h4 className="mb-3 text-xl text-primary text-center">
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
                onSelect={(contribution: any) => {
                  setSelectedContribution(contribution);
                  setIsOpen(true);
                }}
              />
            ) : (
              <RenderContributionCard
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
