import React from 'react';
type Props = {
  usuario: string;
  setUsuario: React.Dispatch<React.SetStateAction<string>>;
  senha: string;
  setSenha: React.Dispatch<React.SetStateAction<string>>;
};

const CustomInputs: React.FC<Props> = ({ usuario, setUsuario, senha, setSenha }) => {
  const [mostrarSenha, setMostrarSenha] = React.useState(false);


  return (
    
    <div>
      <div className="flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Usuário" 
         className="bg-[white] border border-gray-500 text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none" 
          onChange={(e) => setUsuario(e.target.value)} 
          
        />
          <input 
          
            type={mostrarSenha ? "text" : "password"} 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
           className="bg-[white] mt-2 border border-gray-500 text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none" 
           placeholder="Senha" 
          />
            </div>
        <button  
        
          type="button" 
          onClick={() => setMostrarSenha(!mostrarSenha)}
          style={{ marginLeft: "10px" }}
           className='border-transparent bg-[#7a9b82] text-white text-1 py-1.5 mt-2 w-20 self-center hover:bg-[#354F52] hover:text-white rounded' >
          {mostrarSenha ? "Ocultar" : "Mostrar"}
        </button>
  
  </div>
  );
};

export default CustomInputs;
