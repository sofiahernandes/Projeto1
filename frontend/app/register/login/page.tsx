"use client";

import React from "react";
import CustomInputs from "../../../components/login-inputs";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BackHome from "@/components/back-home";

export default function Login() {
  const router = useRouter();
  const [raAlunoMentor, setRaAlunoMentor] = React.useState<number>();
  const [senhaAlunoMentor, setSenhaAlunoMentor] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RaUsuario: raAlunoMentor,
          SenhaUsuario: senhaAlunoMentor,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Erro no login");
        return;
      }
  
      const user = await res.json();

      router.push(`/${user.RaUsuario}/new-contribution`);
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Erro de conexão com o servidor");
    }
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

          <section className="border border-gray-300 rounded-lg m-1 flex flex-col items-center justify-center md:w-1/2 px-6 py-8">
            <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
              Login Alunos-Mentores, Professores e Mentores
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <CustomInputs
                usuario={raAlunoMentor!}
                setUsuario={setRaAlunoMentor}
                senha={senhaAlunoMentor}
                setSenha={setSenhaAlunoMentor}
              />
              <button
                type="submit"
                className="border-transparent bg-secondary text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/70 rounded-lg"
              >
                Entrar
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
