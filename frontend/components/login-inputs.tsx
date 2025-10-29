import React from "react";

export default function CustomInputs() {
  const[ usuario, setUsuario] = React.useState("");
  const[Senha, setSenha] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  return (
    <div>
      <div className="flex flex-col gap-3 items-center">
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          className="w-[80%] bg-[white] border border-gray-300 rounded-lg text-black placeholder-gray-700 px-3 py-1.5 text-base focus:outline-none"
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type={mostrarSenha ? "text" : "password"}
          value={Senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-[80%] bg-[white] border border-gray-300 rounded-lg text-black placeholder-gray-700 px-3 py-1.5 text-base focus:outline-none"
          placeholder="Senha"
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
    </div>
  );
};

