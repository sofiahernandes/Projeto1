"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/donate-page");
  };

  return (
    <div className="w-full">
      <Link href="/" className="underline text-blue-700 fixed p-4">
        Voltar
      </Link>
      <div className="min-h-screen flex items-center justify-center items-center p-6">
        <div className="flex flex-col md:flex-row w-full max-w-3xl">
          <section className="bg-[#1C7C61] h-100 m-1 flex flex-col rounded-lg items-center justify-center md:w-1/2 p-6 text-white">
            <h1 className="flex justify-center font-bold text-[#fff] text-[22px] mb-1">
              Cadastro de Alunos-mentores
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
                <div className="text-base">
                  Nome completo
                  <input
                    id="nome"
                    name="nome"
                    type="text"
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
                    placeholder="Insira seu R.A"
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                  />
                </div>
                <div className="text-base">
                  Senha
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Insira a senha"
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
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
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="border-transparent bg-primary text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-[#354F52] rounded-lg"
                  >
                    Entrar
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
