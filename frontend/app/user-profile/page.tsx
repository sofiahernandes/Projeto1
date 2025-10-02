"use client";

import React, { SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";

import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu-desktop";
import { fetchData } from "@/hooks/fetch-user-profile";
import { Chart } from "@/components/area-chart";

export default function UserProfile() {
  const params = useParams();
  const userId = Number(params.userId);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [user, setUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      const data = await fetchData(userId);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [userId]);

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];

  return (
    <div className="w-screen h-screen overflow-x-clip">
      <div className="absolute justify-between left-0 top-0">
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
        </header>
      </div>

      <div
        className={`${
          menuOpen ? "ml-[270px]" : ""
        } w-full h-full flex justify-center md:items-center transition-all duration-300 ease-in-out`}
      >
        {/* Menu lateral quando está no desktop/tablet */}
        <MenuDesktop
          menuOpen={menuOpen}
          raUsuario={team?.RaUsuario || 10000000}
          setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
        />

        {/* Menu rodapé quando está no mobile */}
        <MenuMobile raUsuario={team?.RaUsuario || 10000000} />

        <main className="w-screen max-w-[1300px] mt-20 md:mt-0 grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col gap-2 mx-3">
            <h3 className="text-2xl uppercase font-semibold text-primary">
              {team?.NomeTime ? team?.NomeTime : "Nome do time aparecerá aqui"}
            </h3>
            <h4 className="mb-3 text-xl text-primary">
              Turma {user?.Turma ? user?.Turma : "X"} | Yº Edição
            </h4>

            <p className="font-semibold">Nome completo</p>
            <p className="block min-h-9 border rounded-md border-gray-400 px-2 mb-4 w-full text-black placeholder-gray-400 py-1 text-base focus:outline-none">
              {user?.NomeUsuario ? user?.NomeUsuario : "Nome aparecerá aqui"}
            </p>

            <p className="font-semibold">R.A do Aluno-mentor</p>
            <p className="block w-full min-h-9 border rounded-md border-gray-400 px-4 mb-3 text-black placeholder-gray-400 py-1 text-base focus:outline-none">
              {team?.RaUsuario ? team?.RaUsuario : "Nome aparecerá aqui"}
            </p>

            <div className="bg-primary rounded-md h-[225px] w-full"></div>
          </div>

          <div className="flex flex-col gap-2 mx-3">
            <p className="font-semibold">Integrantes</p>
            <div className="block w-full h-65 md:h-full border rounded-md border-gray-400 px-4 mt-1 text-black placeholder-gray-400 text-base focus:outline-none">
              {team?.RaAlunos
                ? team?.RaAlunos.split(", ").map((raAluno: string) => <p>{raAluno}</p>)
                : "RAs dos membros aparecerão aqui"}
            </div>
          </div>

          <div className="flex flex-col gap-2 mx-3">
            <div className="h-fit md:h-full items-center w-full rounded-md mb-30 md:mb-0 mt-9">
              <Chart chartData={chartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
