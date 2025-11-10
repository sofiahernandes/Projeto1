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
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [errorTeam, setErrorTeam] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  useEffect(() => {
    if (!IdMentor) {
      console.warn("invalido", params);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function fetchMentorTeam() {
      try {
        setLoadingTeam(true);
        setErrorTeam(null);

        const res = await fetch(`${backend_url}/api/mentor/${IdMentor}/team`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`Falha ao buscar time (${res.status}) ${msg}`);
        }
        const mentorData = await res.json();
        const oneTeam: TeamData | null = Array.isArray(mentorData)
          ? mentorData[0] ?? null
          : (mentorData as TeamData | null);

        if (!active) return;

        console.log("Time do mentor recebido:", oneTeam);
        setTeam(oneTeam);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Erro ao buscar time do mentor:", err);
        setErrorTeam(err?.message ?? "Erro ao buscar time do mentor");
      } finally {
        if (active) setLoadingTeam(false);
      }
    }
    fetchMentorTeam();

    return () => {
      active = false;
      controller.abort();
    };
  }, [IdMentor]);

  useEffect(() => {
    const ra = team?.RaUsuario;
    if (!backend_url) return;
    if (!ra || !Number.isFinite(ra)) {
      setUser(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    async function fetchUser() {
      try {
        setLoadingUser(true);
        setErrorUser(null);

        const res = await fetch(`${backend_url}/api/user/${raUsuario}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Falha ao buscar usuário (${res.status})`);
        const userData = await res.json();
        if (!active) return;

        console.log("Usuário líder recebido:", userData);

        setUser(userData);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Erro ao buscar usuário:", err);
        setErrorUser(err?.message ?? "Erro ao buscar usuário");
      } finally {
        if (active) setLoadingUser(false);
      }
    }

    fetchUser();
    return () => {
      active = false;
      controller.abort();
    };
  }, [team?.RaUsuario]);

  const raUsuario =
    team?.RaUsuario && Number.isFinite(team.RaUsuario)
      ? team.RaUsuario
      : undefined;

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
              {loadingTeam
                ? "Carregando time…"
                : team?.NomeTime || "Nenhum time encontrado"}
            </h3>

            <h4 className="mb-3 text-xl text-primary text-center">
              {loadingUser
                ? "Carregando turma…"
                : `Turma ${user?.TurmaUsuario || "—"}`}
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
                raUsuario={team?.RaUsuario ?? undefined}
                onSelect={(contribution: any) => {
                  setSelectedContribution(contribution);
                  setIsOpen(true);
                }}
              />
            ) : (
              <RenderContributionCard
                raUsuario={team?.RaUsuario ?? undefined}
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
