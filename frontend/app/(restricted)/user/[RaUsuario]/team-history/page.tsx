"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu-desktop";
import RenderContributionCard from "@/components/grid-contribution";
import { fetchData } from "@/hooks/fetch-user-profile";
import RecordsModal from "@/components/records-modal";
import SwitchViewButton from "@/components/toggle-button";
import RenderContributionTable from "@/components/table-contribution";

export default function TeamHistory() {
  const params = useParams();
  const RaUsuario = Number(params.RaUsuario);
  const [menuOpen, setMenuOpen] = useState(false);
  const [team, setTeam] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchTeamData = async () => {
      const data = await fetchData(user, team);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [user, team]);

  return (
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

      <div
        className={`w-full flex justify-center pt-4 transition-all duration-300 ease-in-out ${
          menuOpen ? "md:pl-[270px]" : "ml-0"
        }`}
      >
        {/* Menu lateral quando está no desktop/tablet */}
        <MenuDesktop
          menuOpen={menuOpen}
          setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
        />

        {/* Menu rodapé quando está no mobile */}
        <MenuMobile />

        {/* main page do historico - todas as contribuições do grupo baseado no RA logado */}
        <main className="w-full max-w-[1300px] p-1.5 md:mt-0 ">
          {selectedContribution && (
            <RecordsModal
              data={selectedContribution}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onDeleted={() => {
                setIsOpen(false);
                setSelectedContribution(null);
                setRefreshKey((k) => k + 1); //p dar refetch depois de deletar a doaçao
              }}
            />
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
                setButtonSelected={(arg: SetStateAction<boolean>) => setButtonSelected(arg)}
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
