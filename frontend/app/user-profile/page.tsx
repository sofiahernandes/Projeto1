"use client";

import React, { SetStateAction } from "react";
import { useParams, useRouter } from "next/navigation";

import BackHome from "@/components/back-home";
import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu-desktop";

export default function UserProfile() {
  // const router = useRouter();
  const params = useParams();
  const userId = Number(params.userId);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [idMentor] = React.useState<number>();
  const [raAlunoMentor] = React.useState<number>();
  const [nomeTime] = React.useState("");
  const [nomeAlunoMentor] = React.useState("");
  const [raAlunos] = React.useState("");
  const [turma] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3001/team/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NomeTime: nomeTime,
          RaUsuario: raAlunoMentor,
          RaAlunos: raAlunos,
          IdMentor: idMentor,
        }),
      });

      const userRes = await fetch(`http://localhost:3001/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NomeUsuario: nomeAlunoMentor,
          Turma: turma,
        }),
      });

      if (!res.ok || !userRes.ok) {
        const err = await res.json();
        alert("Erro: " + err.error);
        return;
      }

      const team = await res.json();
      const user = await userRes.json();
      console.log("Time:", team);
      console.log("Aluno Mentor:", user);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar time.");
    }
  };

  return (
    <div className="w-full">
      <div className="absolute left-0 top-0">
        <BackHome />
      </div>

      <div className={`page-container ${menuOpen ? "shifted" : ""}`}>
        {/* Menu lateral quando está no desktop/tablet */}
        <MenuDesktop
          menuOpen={menuOpen}
          raUsuario={raAlunoMentor!}
          setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
        />

        {/* Menu rodapé quando está no mobile */}
        <MenuMobile
          raUsuario={raAlunoMentor!}
        />
        <div className="min-h-screen flex justify-center items-center p-6">
          <main className="w-full max-w-4xl m-1 flex flex-col items-center justify-center md:w-1/2">
            <form onSubmit={handleSubmit} className="p-8 max-w-xl w-full">
              <div className="flex flex-col space-y-2">
                <div>
                  <p className="font-semibold">Nome completo</p>
                  <p className="block min-h-9 border rounded-md border-gray-400 px-2 mt-1 mb-4 text-gray-800 w-full text-black placeholder-gray-400 py-1 text-base focus:outline-none">
                    {nomeAlunoMentor ? nomeAlunoMentor : "Nome aparecerá aqui"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">R.A do Aluno-mentor</p>
                  <p className="block w-full min-h-9 border rounded-md border-gray-400 px-4 mt-1 mb-3 text-gray-800 text-black placeholder-gray-400 py-1 text-base focus:outline-none">
                    {raAlunoMentor ? raAlunoMentor : "Nome aparecerá aqui"}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">R.A dos Alunos</p>
                  <div className="block w-full min-h-65 border rounded-md border-gray-400 px-4 mt-1 mb-3 text-gray-800 text-black placeholder-gray-400 py-2 text-base focus:outline-none">
                     {raAlunos ? raAlunos.split(", ").map((raAluno) => <p>{raAluno}</p>) : "RAs dos membros aparecerão aqui"} 
                  
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
