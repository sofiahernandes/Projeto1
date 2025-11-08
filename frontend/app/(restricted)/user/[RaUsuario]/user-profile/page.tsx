"use client";

import React, { SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";

import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu-desktop";
import { fetchData } from "@/hooks/fetch-user-profile";
import { Chart } from "@/components/area-chart";
import { Contribution } from "@/components/contribution-table/columns";


export default function UserProfile() {
  const params = useParams();
  const RaUsuario = Number(params.RaUsuario);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [contributions, setContributions] = React.useState<Contribution[]>([]);
  const [emailMentor, setEmailMentor] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    const fetchTeamData = async () => {
      const data = await fetchData(RaUsuario);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();

    // const allContributions = [
    //   { month: "January", desktop: 10 },
    //   { month: "February", desktop: 20 },
    //   { month: "March", desktop: 30 },
    //   { month: "April", desktop: 50 },
    //   { month: "May", desktop: 30 },
    //   { month: "June", desktop: 10 },
    // ];

    // setContributions(allContributions);

    const fetchContributions = async () => {
      try {
        const res = await fetch(
          `${backend_url}/api/contributions/${RaUsuario}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.warn("Erro ao buscar contribuições:", errorData.error);
          return; 
        }

        const contributions = await res.json();
        
    console.log("Contribuições recebidas:", contributions);

        setContributions(contributions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContributions();
  }, [RaUsuario]);

  useEffect(() => {
    const fetchEmailMentor = async () => {
      if (!team?.IdMentor) return;
      try {
        const res = await fetch(`${backend_url}/api/mentor/${team.IdMentor}`);
        const emailM = await res.json();
        if (res.ok) setEmailMentor(emailM.EmailMentor);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmailMentor();
  }, [team?.IdMentor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailMentor?.trim()) {
      alert("Por favor, insira um email válido.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${backend_url}/api/createMentor/${RaUsuario}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EmailMentor: emailMentor,
            RaUsuario: RaUsuario,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar o mentor no banco de dados.");
      }
      const MentorData = await response.json();
      setTeam((prevTeam: any) => ({
        ...prevTeam,
        IdMentor: MentorData.IdMentor,
      }));
      alert("Mentor adicionado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar o mentor.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <MenuDesktop
          menuOpen={menuOpen}
          RaUsuario={team?.RaUsuario}
          setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
        />

        <MenuMobile RaUsuario={team?.RaUsuario} />

        <section className="w-[90%] md:max-w-[1300px] md:mt-0 grid grid-cols-1 md:grid-cols-2 h-150 my-5 mb-10 gap-2">
          <div className="flex flex-col gap-3 p-5 border rounded-xl border-gray-200 shadow-xl">
            <h3 className="text-3xl pt-5 uppercase font-semibold text-primary">
              {team?.NomeTime ? team?.NomeTime : "Nome do time aparecerá aqui"}
            </h3>
            <h4 className="mb-3 text-xl text-black">
              Turma {user?.TurmaUsuario ? user?.TurmaUsuario : "X"} | Yº Edição
            </h4>

            <p className="font-semibold">Email Mentor</p>
            <div className="block min-h-9 border rounded-md border-gray-400 px-2 w-full text-black placeholder-gray-400 pt-1 text-base focus:outline-none">
              {team?.IdMentor ? (
                <p>{emailMentor}</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex justify-between">
                  <input
                    type="text"
                    onChange={(e) => setEmailMentor(e.target.value)}
                    value={emailMentor || ""}
                    placeholder="Adicione aqui o Mentor de seu time!"
                    className="w-[85%] h-full focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="underline text-blue-700 h-full"
                  >
                    <img
                      className="text-primary w-6 opacity-60 rotate-180 hover:opacity-70"
                      src="https://img.icons8.com/glyph-neue/64/circled-left-2.png"
                      alt="circled-left-2"
                    />
                  </button>
                </form>
              )}
            </div>

            <p className="font-semibold">Aluno-Mentor</p>
            <p className="block w-full min-h-9 border rounded-md border-gray-400 px-2 text-black placeholder-gray-400 py-1 text-base focus:outline-none">
              {user?.RaUsuario
                ? user?.NomeUsuario
                : "Nome do Usuario aparecerá aqui"}
            </p>
            <p className="font-semibold"> Integrantes do grupo </p>
            <div className="border border-gray-400 rounded-md h-full py-1 px-2 max-w-50">
              {team?.RaAlunos?.length > 0
                ? team.RaAlunos.map((RA: number, index: number) => (
                    <p key={index} className=" mb-1 font-medium">{RA}</p>
                  ))
                : "RAs dos alunos aparecerão aqui"}
            </div>
          </div>

         

          {/* <div className="flex flex-col gap-2 mx-3">
            <p className="font-semibold">Pontuação por Alimento</p>
            <div className="block w-full h-65 md:h-full border rounded-md border-gray-400 px-2 py-1 mt-1 text-black placeholder-red-400 text-base focus:outline-none">
              {/* {team?.RaAlunos
                ? team?.RaAlunos.split(", ").map((raAluno: string) => (
                    <p className="p-2">{raAluno}</p>
                  ))
                : "*Adicionar lógica de pontuação*"} 
               
            </div>
          </div> 

          <div className="flex flex-col justify-between gap-2 mx-3">
            <div className="h-fit md:h-50 items-center w-full rounded-md my-9">
             <Chart chartData={contributions} /> 
            </div>
            <div className="h-[150px] bg-primary items-center w-full rounded-md mb-30 md:mb-0 md:mt-25"></div>
          </div> */}
          <div className="bg-secondary/40 min-h-70 rounded-xl border border-gray-200 shadow-xl">
            <p className=" text-white font-extrabold text-4xl">
              {" "}
              Arkana +
              <br /> Lideranças Empáticas{" "}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
