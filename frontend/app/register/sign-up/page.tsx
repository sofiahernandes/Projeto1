"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BackHome from "@/components/back-home";
import DropdownTurmas from "@/components/dropdown-turmas";

export default function Cadastro() {
  const router = useRouter();
  const [raAlunoMentor, setRaAlunoMentor] = React.useState("");
  const [telefoneAlunoMentor, setTelefoneAlunoMentor] = React.useState("");
  const [nomeAlunoMentor, setNomeAlunoMentor] = React.useState("");
  const [turma, setTurma] = React.useState("");
  const [emailAlunoMentor, setEmailAlunoMentor] = React.useState("");
  const [senhaAlunoMentor, setSenhaAlunoMentor] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não está configurada");
      alert("Erro de configuração. Entre em contato com o suporte.");
      return;
    }

    const apiUrl = backendUrl.endsWith("/")
      ? `${backendUrl}api/register`
      : `${backendUrl}/api/register`;

    console.log("Tentando conectar em:", apiUrl);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RaUsuario: Number(raAlunoMentor),
          NomeUsuario: nomeAlunoMentor,
          EmailUsuario: emailAlunoMentor,
          SenhaUsuario: senhaAlunoMentor,
          TelefoneUsuario: telefoneAlunoMentor,
          Turma: turma,
        }),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro da API:", err);
        alert("Erro: " + (err.error || `Status ${res.status}`));
        return;
      }

      const newUser = await res.json();
      console.log("Usuário cadastrado:", newUser);

      alert("Usuário cadastrado com sucesso!");

      router.push(`/$/new-contribution?userId=${newUser.RaUsuario}`);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        alert(
          "Erro de conexão. Verifique se o backend está rodando e se a URL está correta."
        );
      } else {
        alert("Erro ao cadastrar usuário: " + error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="absolute left-0 top-0">
        <BackHome />
      </div>

      <div className="min-h-screen flex justify-center items-center p-6">
        <div className="flex flex-col md:flex-row w-full max-w-3xl">
          <section className="bg-primary h-120 m-1 flex flex-col rounded-lg items-center justify-center md:w-1/2 p-6 text-white">
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

          <section className="border border-[#b4b4b4] bg-white rounded-lg m-1 flex flex-col items-center justify-center md:w-1/2">
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
                    type="text"
                    value={raAlunoMentor}
                    onChange={(e) => setRaAlunoMentor(e.target.value)}
                    placeholder="Insira seu R.A"
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                  />
                </div>

                <div className="text-base">
                  Número de Celular
                  <input
                    id="telefone"
                    name="telefone"
                    type="string"
                    value={telefoneAlunoMentor}
                    onChange={(e) => setTelefoneAlunoMentor(e.target.value)}
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
                    className="border-transparent text-white hover:text-white! hover:bg-secondary/80 py-2 px-6 bg-secondary self-center rounded-lg"
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
