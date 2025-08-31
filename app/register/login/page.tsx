"use client";

import React from "react";
import CustomInputs from "../../../components/custom-inputs";
import Link from "next/link";

import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Login() {
  const [usuario, setUsuario] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <Link href="/" className="underline text-blue-700 fixed p-4">
        Voltar
      </Link>
      <div className="min-h-screen flex items-center justify-center items-center p-6">
        <div className="flex flex-col md:flex-row w-full max-w-3xl">
          <section className="bg-[#1C7C61] m-1 flex flex-col rounded-lg items-center justify-center md:w-1/2 p-6 text-white">
            <img
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,fit=crop,q=95/dOq4lP0kVLiEl8Z3/lideranaas-empaticas-logo-AoPWG9oBrrt3QGv0.png"
              alt="logo lideranças empáticas"
              className="mb-6 w-28 md:w-36"
            />
            <p className="mb-1 text-sm">É aluno e não tem cadastro?</p>
            <Link
              href="/register/sign-in"
              className="bg-[#eeeeee] text-black px-4 py-1 font-medium hover:bg-[#354F52] hover:text-white mb-4 rounded"
            >
              Cadastre-se
            </Link>
            <p className="text-center text-sm max-w-[220px]">
              Registre-se com seus dados institucionais para utilizar os
              recursos do site.
            </p>
          </section>

          <section className="bg-[#eeeeee] border border-[#b4b4b4] rounded-lg m-1 flex flex-col items-center justify-center md:w-1/2 px-6 py-8">
            <h2 className="text-black font-bold text-xl md:text-xl mb-3">
              Professores
            </h2>
            <SignedOut>
              <SignUpButton>
                <button className="bg-primary text-white rounded-lg font-medium text-sm sm:text-base py-2 cursor-pointer mb-6 w-[80%] hover:bg-[#354F52]">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <h2 className="text-black font-bold text-xl md:text-xl mb-2 mt-4">
              Login Alunos
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <CustomInputs
                usuario={usuario}
                setUsuario={setUsuario}
                senha={senha}
                setSenha={setSenha}
              />
              <button type="submit" className="border-transparent bg-primary text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-[#354F52] rounded-lg">
                 <Link href="/donate-page"> 
                  <span > Entrar </span>
                 </Link> 
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
