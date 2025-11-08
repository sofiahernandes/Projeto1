"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import BackHome from "@/components/back-home";
import { useParams } from "next/navigation";
import RecordsMentor from "@/components/records-mentor";
import RenderContributionCard from "@/components/grid-contribution";
import SwitchViewButton from "@/components/toggle-button";
import RenderContributionTable from "@/components/table-contribution";

interface TeamData {
  IdTime: number;
  NomeTime: string;
  RaUsuario: number | null;
}

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MentorVision() {
  const params = useParams();
  const IdMentor = params?.IdMentor ? Number(params.IdMentor) : null;
  const [team, setTeam] = useState<TeamData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonSelected, setButtonSelected] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const [timesData, setTimesData] = useState<TeamData[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);

  useEffect(() => {
    if (!IdMentor) return;

    const controller = new AbortController();
    let active = true;

    async function fetchMentorTeam() {
      try {
        const res = await fetch(`${backend_url}/api/mentor/${IdMentor}/team`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) return;

        const times: TeamData[] = await res.json();
        if (!active) return;

        setTimesData(times);

        if (times.length > 0) {
          const firstTeam = times[0];
          setSelectedTeam(firstTeam);
          setTeam(firstTeam);

          if (firstTeam.RaUsuario) {
            const userRes = await fetch(
              `${backend_url}/api/user/${firstTeam.RaUsuario}`,
              {
                cache: "no-store",
                signal: controller.signal,
              }
            );

            if (userRes.ok) {
              const userData = await userRes.json();
              if (active) setUser(userData);
            }
          }
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }

    fetchMentorTeam();

    return () => {
      active = false;
      controller.abort();
    };
  }, [IdMentor]);

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

      <div className="w-full flex justify-center pt-4 transition-all duration-300 ease-in-out">
        <main className="w-full self-center max-w-[1300px] p-1.5 md:mt-0">
          {selectedContribution && (
            <RecordsMentor
              data={selectedContribution}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
          <div className="flex flex-col gap-2 mx-3 text-center">
            <h3 className="text-2xl uppercase font-semibold text-primary">
              {team?.NomeTime || "Nome do time aparecerá aqui"}
            </h3>
            <h4 className="mb-3 text-xl text-primary text-center">
              Turma {user?.TurmaUsuario || "X"} | Yº Edição
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