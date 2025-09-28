"use client";

import React, { SetStateAction, useEffect } from "react";
import { useParams } from "next/navigation";
import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu-desktop";
import { fetchData } from "@/hooks/fetch-user-profile";

export default function TeamHistory() {
  const params = useParams();
  const userId = Number(params.userId);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const [user, setUser] = React.useState<any>(null);
  const [team, setTeam] = React.useState<any>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      const data = await fetchData(userId);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [userId]);

  return (
    <div className="w-screen h-screen overflow-x-clip">
      <div className="absolute left-0 top-0">
        <header>
          <button
            type="button"
            className={`open-menu hover:text-primay/60 ${
              menuOpen ? "menu-icon hidden" : "menu-icon"
            }`}
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
        } w-full h-full flex justify-center items-center transition-all duration-300 ease-in-out`}
      >
        {/* Menu lateral quando está no desktop/tablet */}
        <MenuDesktop
          menuOpen={menuOpen}
          raUsuario={team?.RaUsuario || 10000000}
          setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
        />

        {/* Menu rodapé quando está no mobile */}
        <MenuMobile raUsuario={team?.RaUsuario || 10000000} />
      </div>

      <main className="w-screen max-w-[1300px] mt-30 md:mt-0 grid grid-cols-1 md:grid-cols-3">



      </main>
    </div>
  );
}
