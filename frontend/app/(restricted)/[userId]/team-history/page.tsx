"use client";

import React, { SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";
import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu-desktop";
import RenderContribution from "@/components/render-contribution";
import { fetchData } from "@/hooks/fetch-user-profile";
import RecordsModal from "@/components/records-modal";

export default function TeamHistory() {
  const params = useParams();
  const userId = Number(params.userId);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [team, setTeam] = React.useState<any>(null);
  const [user, setUser] = React.useState<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);    
  const [refreshKey, setRefreshKey] = React.useState(0);


  useEffect(() => {
    const fetchTeamData = async () => {
      const data = await fetchData(userId);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [userId]);

  return (
    <div className="min-h-dvh w-full overflow-y-hidden overflow-x-hidden flex flex-col bg-[#f4f3f1]/60">
      <div className="flex flex-col left-0 top-0">
        <header className="py-4">
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
          <h1 className="text-4xl font-semibold text-[#cc3983] self-center">
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
          raUsuario={team?.RaUsuario || 10000000}
          setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
        />

        {/* Menu rodapé quando está no mobile */}
        <MenuMobile raUsuario={team?.RaUsuario || 10000000} />

        {/* main page do historico - todas as contribuições do grupo baseado no RA logado */}
        <main className="w-full max-w-[1300px] p-1.5 md:mt-0">
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
          <div className="flex flex-col gap-2 mx-3 ">
            <h3 className="text-2xl uppercase font-semibold text-primary/85">
              {team?.NomeTime ? team?.NomeTime : "Nome do time aparecerá aqui"}
            </h3>
            <h4 className="mb-3 text-xl text-[#ab3570]">
              Turma {user?.Turma ? user?.Turma : "X"} | Yº Edição
            </h4>
          </div>
          <div className="mx-4 grid grid-cols-1 md:grid-cols-3 gap-4.5 rounded-sm p-2.5">
            <RenderContribution
              refreshKey={refreshKey}
              onSelect={(contribution: any) => {
                setSelectedContribution(contribution);
                setIsOpen(true);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
