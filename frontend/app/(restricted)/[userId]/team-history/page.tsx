"use client";

import React, { SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";
import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu-desktop";
import { fetchData } from "@/hooks/fetch-user-profile";
import RenderContribution from "@/components/render-contribution";

export default function TeamHistory() {
  const params = useParams();
  const userId = Number(params.userId);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [user, setUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);

  // useEffect(() => {
  //   const fetchTeamData = async () => {
  //     const data = await fetchData(userId);
  //     setUser(data?.user);
  //     setTeam(data?.team);
  //   };
  //   fetchTeamData();
  // }, [userId]);

  return (
    <div className="w-screen h-screen overflow-x-clip">
      <div className="flex flex-col left-0 top-0">
        <header>
          <button
            type="button"
            className={`open-menu hover:text-primay/60 ${
              menuOpen ? "menu-icon hidden" : "menu-icon"
            }`}
            onClick={() => setMenuOpen(true)}
          >
            {" "}
            ☰{" "}
          </button>
           <h1 className="text-2xl font-semibold text-green-800 self-center mt-4">
              Histórico de contribuições
            </h1>
        </header>
      </div>

      <div
        className={`w-full h-full flex justify-center pt-4 transition-all duration-300 ease-in-out ${
          menuOpen ? "md:ml-[270px]" : "ml-0"
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

        {/* main page do historico - todas as contribuições do grupo */}
        <main className="w-screen max-w-[1300px] p-1.5 md:mt-0">
          {/*grid grid-cols-1 md:grid-cols-3*/}
          <div className="flex flex-col gap-2 mx-3">
            <h3 className="text-2xl uppercase font-semibold text-primary">
              {team?.NomeTime ? team?.NomeTime : "Nome do time aparecerá aqui"}
            </h3>
            <h4 className="mb-3 text-xl text-primary">
              Turma {team?.Turma ? team?.Turma : "X"} | Yº Edição
            </h4>
          </div>
          <div className="bg-[#d4ddd7] mx-4 grid grid-cols-1 md:grid-cols-3 gap-4.5 rounded-sm p-2.5">
            <RenderContribution/>
          </div>

        </main>
      </div>
    </div>
  );
}
