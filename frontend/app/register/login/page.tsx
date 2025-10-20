"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TabsLogin from "@/components/tabs-login";
import BackHome from "@/components/back-home";

export default function Login() {
  const router = useRouter();
  const [raAlunoMentor, setRaAlunoMentor] = React.useState("");
  const [senhaAlunoMentor, setSenhaAlunoMentor] = React.useState("");
  const [emailMentor, setEmailMentor] = React.useState("");
  const [senhaMentor, setSenhaMentor] = React.useState("");

  const handleAlunoSubmit = async (e: React.FormEvent) => {
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
          RaUsuario: Number(raAlunoMentor),
          SenhaUsuario: senhaAlunoMentor,
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

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        alert(
          "Erro de conexão. Verifique se o backend está rodando e se a URL está correta."
        );
      } else {
        alert("Erro ao cadastrar usuário: " + error);
      }
    }
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //direciona para a pagina pos login do mentor 
  };

  return (
    <div className="w-full">
      <div className="absolute left-0 top-0">
        <BackHome />
      </div>

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col md:flex-row w-full max-w-3xl">
          <section className="bg-primary m-1 flex flex-col rounded-lg items-center justify-center md:w-1/2 p-6 text-white">
            <img
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,fit=crop,q=95/dOq4lP0kVLiEl8Z3/lideranaas-empaticas-logo-AoPWG9oBrrt3QGv0.png"
              alt="logo lideranças empáticas"
              className="mb-6 w-28 md:w-36"
            />
            <p className="mb-1 text-sm">É aluno e não tem cadastro?</p>
            <Link
              href="/register/sign-up"
              className="bg-background text-black px-4 py-1 font-medium hover:bg-background/70 mb-4 rounded"
            >
              Cadastre-se
            </Link>
            <p className="text-center text-sm max-w-[220px]">
              Registre-se com seus dados institucionais para utilizar os
              recursos do site.
            </p>
          </section>

          <section className="flex flex-col justify-center md:w-1/2">
            <TabsLogin 
            onSubmitAluno={handleAlunoSubmit}
            onSubmitMentor={handleMentorSubmit}
            raAlunoMentor={raAlunoMentor}
            setRaAlunoMentor={setRaAlunoMentor}
            senhaAlunoMentor={senhaAlunoMentor}
            setSenhaAlunoMentor={setSenhaAlunoMentor}
            emailMentor={emailMentor}
            setEmailMentor={setEmailMentor}
            senhaMentor={senhaMentor}
            setSenhaMentor={setSenhaMentor}/>

        </section>
      </div>
    </div>
   </div>
  );
}
