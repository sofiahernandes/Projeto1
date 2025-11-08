"use client";

import React, { SetStateAction, useEffect } from "react";
import BackHome from "@/components/back-home";
import RecordsMentor from "@/components/records-mentor";
import SwitchViewButton from "@/components/toggle-button";
import MenuDesktopAdmin from "@/components/menu-desktop-admin";
import MenuMobileAdmin from "@/components/menu-mobile-admin";
import RenderContributionTableAdmin from "@/components/table-contribution-admin";
import RenderContributionCardAdmin from "@/components/grid-contribution-admin";
import { useParams } from "next/navigation";

{
  /** 
 * 
 corrigir modal admin - tirar Gastos, aumentar fonte da data 
 adicionar filtro de pesquisar por ediçao
 adicionar filtro de edições
  */
}

export default function AdminPageVision() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);

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
              Histórico de contribuições
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
