import React from "react";

type Props = {
  usuario: string;
  setUsuario: React.Dispatch<React.SetStateAction<string>>;
  senha: string;
  setSenha: React.Dispatch<React.SetStateAction<string>>;
};

const CustomInputs: React.FC<Props> = ({
  usuario,
  setUsuario,
  senha,
  setSenha,
}) => {
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  return (
    <div>
      <div className="flex flex-col gap-3 items-center">
        <input
          type="text"
          placeholder="Registro Acadêmico (RA)"
          value={usuario}
          className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type={mostrarSenha ? "text" : "password"}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-[80%] bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
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

export default CustomInputs;
