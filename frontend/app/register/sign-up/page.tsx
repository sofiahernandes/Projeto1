"use client";

import React from "react";
import { useRouter } from "next/navigation"; 
import BackHome from "@/components/back-home";
import DropdownTurmas from "@/components/dropdown-turmas";

export default function Cadastro() {
  const router = useRouter();
  const [raAlunoMentor, setRaAlunoMentor] = React.useState<number>();
  const [telefoneAlunoMentor, setTelefoneAlunoMentor] =
    React.useState<number>();
  const [nomeAlunoMentor, setNomeAlunoMentor] = React.useState("");
  const [turma, setTurma] = React.useState("");
  const [emailAlunoMentor, setEmailAlunoMentor] = React.useState("");
  const [senhaAlunoMentor, setSenhaAlunoMentor] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL+ "api/register";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RaUsuario: raAlunoMentor,
          NomeUsuario: nomeAlunoMentor,
          EmailUsuario: emailAlunoMentor,
          SenhaUsuario: senhaAlunoMentor,
          TelefoneUsuario: telefoneAlunoMentor,
          Turma: turma,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Erro: " + err.error);
        return;
      }

      const newUser = await res.json();
      console.log("Usuário cadastrado:", newUser);

      // redireciona para contribuições passando o id
      router.push(`/${newUser.RaUsuario}/new-contribution`);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário");
    }
  };

  return (
    <div className="w-full">
      <div className="absolute left-0 top-0">
        <BackHome />
      </div>

      <div className="min-h-screen flex justify-center items-center p-6">
        <div className="flex flex-col md:flex-row w-full max-w-3xl">
          <section className="bg-[#1C7C61] h-120 m-1 flex flex-col rounded-lg items-center justify-center md:w-1/2 p-6 text-white">
            <h1 className="flex text-center font-bold text-[#fff] text-[22px] mb-1">
              Cadastro de
              <br />
              Alunos-mentores
            </h1>
            <img
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,fit=crop,q=95/dOq4lP0kVLiEl8Z3/lideranaas-empaticas-logo-AoPWG9oBrrt3QGv0.png"
              alt="logo lideranças empáticas"
              className="mb-6 w-28 md:w-36"
            />
          </section>

          <section className="bg-[#eeeeee] border border-[#b4b4b4] rounded-lg m-1 flex flex-col items-center justify-center md:w-1/2">
            <form onSubmit={handleSubmit} className="p-8 max-w-xl w-full">
              {/*Container Esquerda*/}
              <div className="flex flex-col space-y-2">
                <DropdownTurmas turma={turma} setTurma={setTurma} />

                <div className="text-base">
                  Nome completo
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={nomeAlunoMentor}
                    onChange={(e) => setNomeAlunoMentor(e.target.value)}
                    placeholder="Insira seu nome completo"
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                  />
                </div>

                <div className="text-base">
                  Email Institucional
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={emailAlunoMentor}
                    onChange={(e) => setEmailAlunoMentor(e.target.value)}
                    placeholder="Insira o email institucional"
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                  />
                </div>

                <div className="text-base">
                  R.A do Aluno-mentor
                  <input
                    id="ra"
                    name="ra"
                    type="number"
                    value={raAlunoMentor}
                    onChange={(e) => setRaAlunoMentor(Number(e.target.value))}
                    placeholder="Insira seu R.A"
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                  />
                </div>

                <div className="text-base">
                  Número de Celular
                  <input
                    id="telefone"
                    name="telefone"
                    type="number"
                    value={telefoneAlunoMentor}
                    onChange={(e) =>
                      setTelefoneAlunoMentor(Number(e.target.value))
                    }
                    placeholder="Insira seu Número"
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                  />
                </div>

                <p className="mb-0">Senha</p>
                <div className="text-base flex">
                  <input
                    id="senha"
                    name="senha"
                    type={mostrarSenha ? "text" : "password"}
                    value={senhaAlunoMentor}
                    onChange={(e) => setSenhaAlunoMentor(e.target.value)}
                    placeholder="Insira a senha"
                    className="block w-[75%] mr-2 bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                  />
                  <button
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="hidden rounded-lg"
                  >
                    {mostrarSenha ? (
                      <img src="../assets/EyeClosed.png" />
                    ) : (
                      <img src="../assets/EyeOpen.png" />
                    )}
                  </button>
                  <button
                    type="submit"
                    className="border-transparent text-white py-2 px-6 bg-primary self-center rounded-lg"
                  >
                    Cadastrar
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
