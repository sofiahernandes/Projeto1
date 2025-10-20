"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomInputs from "./login-inputs";
import handleSubmit from "../app/register/login/page";

type TabsLoginProps = {
  onSubmitAluno: (e: React.FormEvent) => void;
  onSubmitMentor: (e: React.FormEvent) => void;
  raAlunoMentor: string;
  setRaAlunoMentor: React.Dispatch<React.SetStateAction<string>>;
  senhaAlunoMentor: string;
  setSenhaAlunoMentor: React.Dispatch<React.SetStateAction<string>>;
  emailMentor: string;
  setEmailMentor: React.Dispatch<React.SetStateAction<string>>;
  senhaMentor: string;
  setSenhaMentor: React.Dispatch<React.SetStateAction<string>>;
};
const TabsLogin: React.FC<TabsLoginProps> = ({
  onSubmitAluno,
  onSubmitMentor,
  raAlunoMentor,
  setRaAlunoMentor,
  senhaAlunoMentor,
  setSenhaAlunoMentor,
  emailMentor,
  setEmailMentor,
  senhaMentor,
  setSenhaMentor,
}) => {
  return (
    <Tabs defaultValue="Aluno" className="md:w-[700px]">
      <TabsList>
        <TabsTrigger value="Aluno" className="hover:cursor-pointer">
          Aluno-Mentor
        </TabsTrigger>
        <TabsTrigger value="Mentor" className="hover:cursor-pointer">
          Professor-Mentor
        </TabsTrigger>
        <TabsTrigger value="Admin"> Administrador</TabsTrigger>
      </TabsList>
      <TabsContent value="Aluno">
        <section className="border border-gray-300 rounded-lg m-1 flex flex-col items-center justify-center md:w-1/2 px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login de Alunos-Mentores
          </h2>
          <form onSubmit={onSubmitAluno} className="flex flex-col gap-4 w-full">
            <CustomInputs
              usuario={raAlunoMentor!}
              setUsuario={setRaAlunoMentor}
              senha={senhaAlunoMentor}
              setSenha={setSenhaAlunoMentor}
            />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>

      <TabsContent value="Mentor">
        <section className="border border-gray-300 rounded-lg m-1 flex flex-col items-center justify-center md:w-1/2 px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login Professores-Mentores
          </h2>
          <form
            onSubmit={onSubmitMentor}
            className="flex flex-col gap-4 w-full"
          >
            <CustomInputs
              usuario={emailMentor}
              setUsuario={setEmailMentor}
              senha={senhaMentor}
              setSenha={setSenhaMentor}
            />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>
      <TabsContent value="Admin">
        <section className="border border-gray-300 rounded-lg m-1 flex flex-col items-center justify-center md:w-1/2 px-6 py-8">
          <h2 className="text-secondary text-center font-bold text-xl md:text-xl my-4">
            Login Administradores
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4 w-full"
          >
            <CustomInputs
              usuario={""}
              setUsuario={() => {}}
              senha={""}
              setSenha={() => {}}
            />
            <button
              type="submit"
              className="border-transparent bg-secondary hover:text-white! text-white text-base py-2 px-6 w-[90px] md:w-28 self-center hover:bg-secondary/80 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </section>
      </TabsContent>
    </Tabs>
  );
};
export default TabsLogin;
