"use client";

import React, { SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";

import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu-desktop";
import { fetchData } from "@/hooks/fetch-user-profile";
import { Chart } from "@/components/area-chart";

interface Contribution {
  month: string
  desktop: number;
}

export default function UserProfile() {
  const params = useParams();
  const userId = Number(params.userId);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [contributions, setContributions] = React.useState<Contribution[]>([]);
  const [emailMentor, setEmailMentor] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);

  useEffect(() => {
    // const fetchTeamData = async () => {
    //   const data = await fetchData(userId);
    //   setUser(data?.user);
    //   setTeam(data?.team);
    // };
    // fetchTeamData();

    const allContributions = [
      { month: "January", desktop: 10 },
      { month: "February", desktop: 20 },
      { month: "March", desktop: 30 },
      { month: "April", desktop: 50 },
      { month: "May", desktop: 30 },
      { month: "June", desktop: 10 }
    ]

    setContributions(allContributions);

    const fetchContributions = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/contributions/${userId}`);
        const contributions = await res.json();

        if (res.ok) setContributions(contributions);
      } catch (err) {
        console.error(err);
      }
    }
    fetchContributions();

    const fetchEmailMentor = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/mentor/id/${emailMentor}`);
        const contributions = await res.json();

        if (res.ok) setContributions(contributions);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmailMentor();
  }, [userId, emailMentor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailMentor?.trim() === "") {
      alert("Por favor, insira um email válido.");
      return;
    }

    setIsSubmitting(true); // Set submitting state to true

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ EmailMentor: emailMentor }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar o mentor no banco de dados.");
      }

      // Simulate updating the team state after successful API call
      setTeam({ ...team, IdMentor: true });
      alert("Mentor adicionado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar o mentor.");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="w-screen h-screen overflow-x-clip">
      <div className="absolute justify-between left-0 top-0">
        <header>
          <button
            type="button"
            className={`open-menu hover:text-primay/60 ${menuOpen ? "menu-icon hidden" : "menu-icon"
              }`}
            onClick={() => setMenuOpen(true)}
          >
            {" "}
            ☰{" "}
          </button>
        </header>
      </div>

      <div
        className={`${menuOpen ? "ml-[270px]" : ""
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

            <p className="font-semibold">Email Mentor</p>
            <p className="block min-h-9 border rounded-md border-gray-400 px-2 mb-4 w-full text-black placeholder-gray-400 py-1 text-base focus:outline-none">
              {team?.IdMentor
                ? emailMentor
                : (
                  // Falta adicionar o emailMentor a database em si
                  <form onSubmit={handleSubmit}>
                    <input type="text" onChange={(e) => setEmailMentor(e.target.value)} value={emailMentor} placeholder="Adicione aqui seu Mentor!" className="w-[85%] h-full focus:outline-none" />
                    <button type="submit" className="underline text-blue-700">
                      <img
                        width="30"
                        height="30"
                        className="text-primary opacity-60 hover:opacity-70"
                        src="https://img.icons8.com/glyph-neue/64/circled-left-2.png"
                        alt="circled-left-2"
                      />
                    </button>
                  </form>
                )
              }
            </p>

            <p className="font-semibold">R.A do Aluno-mentor</p>
            <p className="block w-full min-h-9 border rounded-md border-gray-400 px-4 mb-3 text-black placeholder-gray-400 py-1 text-base focus:outline-none">
              {team?.RaUsuario ? team?.RaUsuario : "Nome aparecerá aqui"}
            </p>

            <div className="border border-gray-400 rounded-md h-[225px] w-full">
              {team?.RaAlunos
                ? team?.RaAlunos.split(", ").map((raAluno: string) => <p>{raAluno}</p>)
                : "RAs dos membros aparecerão aqui"}
            </div>
          </div>

          <div className="flex flex-col gap-2 mx-3">
            <p className="font-semibold">Integrantes</p>
            <div className="block w-full h-65 md:h-full border rounded-md border-gray-400 px-4 mt-1 text-black placeholder-gray-400 text-base focus:outline-none">
              {team?.RaAlunos
                ? team?.RaAlunos.split(", ").map((raAluno: string) => <p className="p-2">{raAluno}</p>)
                : "RAs dos membros aparecerão aqui"}
            </div>
          </div>

          <div className="flex flex-col gap-2 mx-3">
            <div className="h-fit md:h-full items-center w-full rounded-md mb-30 md:mb-0 mt-9">
              <Chart chartData={contributions} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
