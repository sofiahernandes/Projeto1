"use client";

import React, { SetStateAction, useEffect } from "react";
import BackHome from "@/components/back-home";
import RecordsMentor from "@/components/records-mentor";
import SwitchViewButton from "@/components/toggle-button";
import MenuDesktopAdmin from "../menu-desktop-admin";
import MenuMobileAdmin from "../menu-mobile-admin";
import RenderContributionTableAdmin from "@/components/table-contribution-admin";
import RenderContributionCardAdmin from "@/components/grid-contribution-admin";
import { useParams } from "next/navigation";

{
  /** 
 * corrigir menus, quando tiver o params do admin - ok
 corrigir params do admin igual de mentor, com alo que identifique ele (email ou id) - nao precisa
 corrigir a url e a organização de pasta - ok
 corrigir modal admin
 adicionar filtro de pesquisar por ediçao
 adicionar filtro de edições
 adicionar profile do admin com função de cadastrar novos admins
 corrigir rota de login do adm, quando tiver o params dele
  */
}

export default function AdminPageVision() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);

  const [adminId, setAdminId] = React.useState<number | null>(null);

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setAdminId(parsed?.IdMentor || 10000000);
    }
  }, []);

  return (
    <div className="min-h-dvh w-full overflow-y-hidden overflow-x-hidden flex flex-col bg-[#f4f3f1]/60">
      <div className="flex flex-col left-0 top-0">
        <header className="py-4 mt-6 relative flex justify-center items-center">
          <button
            type="button"
            className={`open-menu hover:text-primary/60 ${
              menuOpen ? "menu-icon hidden" : "menu-icon"
            }`}
            onClick={() => setMenuOpen(true)}
          >
            {" "}
            ☰{" "}
          </button>
          <h1
            className={`text-4xl font-semibold text-[#cc3983] text-center transition-all duration-300 ease-in-out ${
              menuOpen ? "md:pl-[270px]" : "ml-0"
            }`}
          >
            Histórico de contribuições
          </h1>
        </header>
      </div>

      <div
        className={`w-full flex justify-center pt-4 transition-all duration-300 ease-in-out ${
          menuOpen ? "md:pl-[270px]" : "ml-0"
        }`}
      >
        <MenuDesktopAdmin menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <MenuMobileAdmin />

        <main className="w-full max-w-[1300px] p-1.5 md:mt-0 ">
          {selectedContribution && (
            <RecordsMentor
              data={selectedContribution}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
          <div className="flex flex-col gap-2 mx-3 text-center">
            <h3 className="text-2xl uppercase font-semibold text-primary ">
              Histórico de contribuições da Edição Yº do Projeto Lideranças
              Empáticas {/** definir a edição no codigo */}
            </h3>
            <div className="self-end">
              <SwitchViewButton
                buttonSelected={buttonSelected}
                setButtonSelected={(arg: SetStateAction<boolean>) =>
                  setButtonSelected(arg)
                }
              />
            </div>
          </div>
          <div className="mt-2">
            {buttonSelected ? (
              <RenderContributionTableAdmin
                onSelect={(contribution: any) => {
                  setSelectedContribution(contribution);
                  setIsOpen(true);
                }}
              />
            ) : (
              <RenderContributionCardAdmin
                onSelect={(contribution: any) => {
                  setSelectedContribution(contribution);
                  setIsOpen(true);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
