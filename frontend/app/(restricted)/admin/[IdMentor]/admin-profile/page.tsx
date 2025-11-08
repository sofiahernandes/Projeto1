"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import MenuMobileAdmin from "@/components/menu-mobile-admin";
import MenuDesktopAdmin from "@/components/menu-desktop-admin";
import { useParams } from "next/navigation";

export default function AdminProfile() {
  const params = useParams();
  const adminId = parseInt(params.IdMentor as string, 10);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [adminLogado, setAdminLogado] = React.useState<string>();
  const [newEmailMentor, setNewEmailMentor] = React.useState<string>();
  const [senhaMentor, setSenhaMentor] = React.useState<string>();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/mentor/id/${adminId}`);
        if (!response.ok) throw new Error("Erro ao buscar dados do mentor");
        const data = await response.json();
        setAdminLogado(data.EmailMentor);
      } catch (err) {
        console.error(err);
      }
    };
    if (adminId !== null) {
      fetchAdminData();
    }
  }, [adminId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailMentor?.trim()) {
      alert("Por favor, insira um email válido.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/createAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          EmailMentor: newEmailMentor,
          SenhaMentor: senhaMentor,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar novo admin no banco de dados.");
      }
      await response.json();
      alert("Mentor adicionado com sucesso!");

      setNewEmailMentor("");
      setSenhaMentor("");
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <div className="w-screen h-screen overflow-x-clip ">
      <div className="">
        <header>
          <button
            type="button"
            className={`open-menu hover:text-primary/60 ${
              menuOpen ? "menu-icon hidden" : "menu-icon"
            } absolute justify-between left-0 top-0`}
            onClick={() => setMenuOpen(true)}
          >
            {" "}
            ☰{" "}
          </button>
        </header>
      </div>

      <div
        className={`${
          menuOpen ? "ml-[270px]" : ""
        } w-full h-full flex justify-center md:items-center transition-all duration-300 ease-in-out`}
      >
        <MenuDesktopAdmin
          menuOpen={menuOpen}
          setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
        />

        <MenuMobileAdmin />

        <section className="max-w-[90%] md:max-w-[1300px] md:mt-0 grid grid-cols-1 md:grid-cols-2  h-150 my-5 mb-10 gap-2">
          <div className="flex flex-col gap-2 p-5 border border-gray-200 shadow-xl bg-white rounded-xl">
            <h1 className="text-3xl pt-8 text-primary mb-5 font-semibold">
              {" "}
              Perfil do Administrador
            </h1>

            <h3 className="text-xl font-semibold text-black  w-full">
              {adminLogado}
            </h3>

            <h2 className="text-lg w-full">
              Cadastre abaixo um novo administrador ao Arkana:
            </h2>
            <p className="font-sm text-gray-600">
              {" "}
              Ele terá os mesmos acessos que você, como o histórico de
              contribuições de todos os grupos!
            </p>

            <div className=" mt-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <p> Email do novo administrador: </p>
                <input
                  type="text"
                  onChange={(e) => setNewEmailMentor(e.target.value)}
                  value={newEmailMentor || ""}
                  placeholder="NovoAdministrador@gmail.com"
                  className="w-[85%] h-full  w-full focus:outline-none block min-h-9 border rounded-md border-gray-400 px-2 mb-3 text-black placeholder-gray-400 pt-1 text-base"
                />
                <p> Senha do novo administrador: </p>
                <input
                  type="password"
                  onChange={(e) => setSenhaMentor(e.target.value)}
                  value={senhaMentor || ""}
                  placeholder="Senha do novo administrador"
                  className="w-[85%] h-full  w-full focus:outline-none block min-h-9 border rounded-md border-gray-400 px-2 mb-3 text-black placeholder-gray-400 pt-1 text-base "
                />
                <button
                  type="submit"
                  className="text-white bg-primary hover:bg-primary/80  self-start border border-gray-200 px-4 py-1 my-2 rounded-md  cursor-pointer font-medium transition"
                >
                  Cadastrar
                </button>
              </form>
            </div>
          </div>
          <div className="bg-primary min-h-70 rounded-xl border border-gray-200 shadow-xl">
            <p className=" text-white font-extrabold text-4xl">
              {" "}
              Arkana +
              <br /> Lideranças Empáticas{" "}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
