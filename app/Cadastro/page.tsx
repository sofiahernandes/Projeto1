'use client';
import React from 'react';
export default function Cadastro() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado");
  };

  return (
    
    <div className="bg-[#e6ede5] min-h-screen flex items-center justify-center p-6">
      <div className="bg-[#1C7C61] ">
        <h1 className=" flex justify-center m-4 font-bold text-[#fff] text-[22px] mb-1">Cadastro de Alunos-mentores</h1>
      <form  onSubmit={handleSubmit} className="p-8 max-w-4xl w-full text-white grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
    
                   {/*Container Esquerda*/ }
         <div className='flex flex-col space-y-4'>
             <div className="text-base">
              Nome completo
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder='Insira seu nome completo'
                className=" flex mt-1 w-[250px] bg-[#dae1d8] text-[#000] px-2 py-1 focus:outline-none placeholder-[#357266]"
              />
            </div>

            < div className="text-base ">
              Email Institucional
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Insira o email institucional"
                className="flex mt-1 w-[250px]  bg-[#dae1d8] text-[#000] px-2 py-1 focus:outline-none placeholder-[#357266]"
              />
            </div>

            <div className="text-base">
              R.A do Aluno-mentor
              <input
                id="ra"
                name="ra"
                type="text"
                placeholder="Insira seu R.A"
                className=" flex mt-1 w-[250px] bg-[#dae1d8] text-[#000] px-2 py-1 text-base focus:outline-none placeholder-[#357266]"
              />
            </div>
      </div>
      {/*Container Direita*/ }
        <div className="text-xs text-white flex flex-col space-y-4">
             <div className="text-base">
              Senha
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Insira a senha"
                    className="flex flex-col mt-1 w-[250px] bg-[#dae1d8] text-[#000] px-2 py-1 focus:outline-none placeholder-[#357266]"
                  />
                    <button
                        type="button"
                        className="bg-[#b1c1aa] text-[#0f3b2f] ml-2 px-2 py-0.5 rounded-sm font-normal mt-2"
                        onClick={() => {
                          const senhaInput = document.getElementById('senha') as HTMLInputElement;
                          if (senhaInput) {
                            senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
                          }
                          {senhaInput ? "Ocultar" : "Mostrar"}
                        }} > Mostrar senha </button>
                </div>

              <div className="text-base flex flex-col">
                Confirme a senha
                <input
                  id="confirme-senha"
                  name="confirme-senha"
                  type="password"
                  placeholder="Insira a senha"
                  className=" flex flex-col  w-[250px] mt-1 bg-[#dae1d8] text-[#1b6e56] px-1 py-0.5 focus:outline-none placeholder-[#357266]"
                />
              </div>
                  <div className="flex items-end justify-end">
                    <button
                      type="submit"
                      className="bg-[#d1d5db] text-[#0f3b2f] font-semibold px-4 py-1 rounded-sm mt-2"
                    > Entrar
                    </button>
                 </div>
        </div>
      </form>
    </div>
    </div>
  );
}
