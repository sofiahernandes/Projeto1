"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInputs from "./login-inputs";
import { useRouter } from "next/navigation";

export default function TabsLogin() {
  const router = useRouter();
  const [EmailMentor] = React.useState("");
  const RaAluno1 = window.localStorage.getItem("RaAluno1")
  const SenhaUsuario = window.localStorage.getItem("SenhaAlunoMentor");

  const handleSubmitAluno = async (e: React.FormEvent) => {
    e.preventDefault();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não está configurada");
      alert("Erro de configuração. Entre em contato com o suporte.");
      return;
    }

    const apiUrl = `${backendUrl}/api/user/login`;

    console.log("Tentando conectar em:", apiUrl);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          RaUsuario: (RaAluno1),
          SenhaUsuario: SenhaUsuario
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

      const User = await res.json();
      console.log("Usuário Logado:", User);

      alert("Usuário Logado com sucesso!");

      router.push(`/$/new-contribution?userId=${User.RaUsuario}`);
    } catch (error) {
      console.error("Erro ao logar usuário:", error);
    }
  };

  const handleSubmitMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não está configurada");
      alert("Erro de configuração. Entre em contato com o suporte.");
      return;
    }

    const apiUrl = `${backendUrl}/api/user/login`;

    console.log("Tentando conectar em:", apiUrl);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailMentor: EmailMentor,
          RaUsuario: Number(RaAluno1)
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

      const User = await res.json();
      console.log("Usuário Logado:", User);

      alert("Usuário Logado com sucesso!");

      router.push("");
      //direciona para a pagina pos login do mentor 
    } catch (error) {
      console.error("Erro ao logar usuário:", error);
    }

  };

  const handleSubmitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    // direcionamento para a página do admin 

  }

  return (
    <Tabs defaultValue="Aluno" className="md:w-[700px] h-full mb-1">
      <TabsList className="flex gap-1">
        <TabsTrigger value="Aluno" className="hover:cursor-pointer">
          Aluno-Mentor
        </TabsTrigger>
        <TabsTrigger value="Mentor" className="hover:cursor-pointer">
          Mentor
        </TabsTrigger>
        <TabsTrigger value="Admin"> Admin</TabsTrigger>
      </TabsList>

      <TabsContent value="Aluno">
        <section className="border border-gray-300 h-full rounded-lg mb-2 flex flex-col items-center justify-center md:w-[365px] px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login de Alunos-Mentores
          </h2>
          <form onSubmit={handleSubmitAluno} className="flex flex-col gap-4 w-full">
            <CustomInputs />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>

      <TabsContent value="Mentor">
        <section className="border border-gray-300 h-full rounded-lg mb-2 flex flex-col items-center justify-center md:w-[365px] px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login Mentores
          </h2>
          <form
            onSubmit={handleSubmitMentor}
            className="flex flex-col gap-4 w-full"
          >
            <CustomInputs
            />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>
      <TabsContent value="Admin">
        <section className="border border-gray-300 h-full rounded-lg mb-2 flex flex-col items-center justify-center md:w-[365px] px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login Administradores
          </h2>
          <form
            onSubmit={handleSubmitAdmin}
            className="flex flex-col gap-4 w-full"
          >
            <CustomInputs />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>
    </Tabs>
  );
};
