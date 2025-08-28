'use client'
import React from "react";
import CustomInputs from "./components/CustomInputs";
import Link from "next/link";

export default function Login() {
  const [usuario, setUsuario] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuário:", usuario);
    console.log("Senha:", senha);
  };

  return (
    <div className="bg-[#E8F0E8] flex items-center justify-center min-h-screen px-2">
      <div className="flex flex-col md:flex-row w-full max-w-3xl shadow-lg ">
        <section className="bg-[#1C7C61] flex flex-col items-center justify-center md:w-1/2 p-6 text-white">
          <img
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,fit=crop,q=95/dOq4lP0kVLiEl8Z3/lideranaas-empaticas-logo-AoPWG9oBrrt3QGv0.png"
            alt="logo lideranças empáticas"
            className="mb-6 w-28 md:w-36"
          />
          <p className="mb-1 text-sm">Não tem cadastro?</p>
          <Link href="/Login/Cadastro" className="bg-[#d9d9d9] text-black px-4 py-1 font-medium hover:bg-[#354F52] hover:text-white mb-4 rounded">
            Cadastre-se
          </Link>
          <p className="text-center text-sm max-w-[220px]">
            Registre-se com seus dados institucionais para utilizar os recursos do site.
          </p>
        </section>

        <section className="bg-[#d9d9d9] flex flex-col justify-center md:w-1/2 px-6 py-8">
          <h1 className="text-black font-bold text-2xl md:text-3xl mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <CustomInputs
              usuario={usuario}
              setUsuario={setUsuario}
              senha={senha}
              setSenha={setSenha}
            />
            <button
              type="submit"
              className="border-transparent bg-[#7a9b82] text-white text-base py-2 px-6 mt-4 w-[90px] md:w-28 self-center hover:bg-[#354F52] rounded"
            >
              Entrar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
