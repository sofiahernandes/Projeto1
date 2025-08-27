import React from "react";
import CustomInputs from "./components/CustomInputs";

export default function Login() {
  const [usuario, setUsuario] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuário:", usuario);
    console.log("Senha:", senha);
  };

  return (
    <div className="bg-[#E8F0E8] flex items-center justify-center h-screen sm:text-left">
    
      <div className="flex w-[700px] shadow-lg ">
    
        <section className="bg-[#1C7C61] flex flex-col @md:flex-row items-center justify-center w-1/2 p-6 text-white">
          <img
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,fit=crop,q=95/dOq4lP0kVLiEl8Z3/lideranaas-empaticas-logo-AoPWG9oBrrt3QGv0.png"
            alt="logo lideranças empáticas"
            className="mb-6 w-36"
          />
          <p className="mb-1 text-sm">Não tem cadastro?</p>
          <a href="/Cadastro"
          className="bg-[#d9d9d9] text-black px-4 py-1 font-medium hover:bg-[#354F52] hover:text-white mb-4">
            Cadastre-se
          </a>
          <p className="text-center text-sm max-w-[220px]">
            Registre-se com seus dados institucionais para utilizar os recursos
            do site.
          </p>
        </section>

        
        <section className="bg-[#d9d9d9] flex flex-col @md:flex-col justify-center w-1/2 px-10 py-6 ">
          <h1 className="text-black font-bold flex text-2xl mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <CustomInputs
              usuario={usuario}
              setUsuario={setUsuario}
              senha={senha}
              setSenha={setSenha}
            />
            <button
              type="submit"
              className=" border-transparent bg-[#7a9b82] text-white text-m py-2 px-6 mt-4 w-28 self-center hover:bg-[#354F52]"
            >
              Entrar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
