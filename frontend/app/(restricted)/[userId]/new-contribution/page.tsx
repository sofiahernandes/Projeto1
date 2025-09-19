"use client";

import { SetStateAction, useState } from "react";

import MenuDesktop from "@/components/menu-desktop";
import MenuMobile from "@/components/menu-mobile";
import DonationsForm from "@/components/donations-form";
import BackHome from "@/components/back-home";

export default function Donations() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="container w-full">
      <div className="md:hidden absolute left-0 top-0">
        <BackHome />
      </div>
      <header>
        <button
          className={`open-menu ${menuOpen ? "menu-icon hidden" : "menu-icon"}`}
          onClick={() => setMenuOpen(true)}
        >
          {" "}
          ☰{" "}
        </button>
      </header>
      <div className="content">
        <div className={`page-container ${menuOpen ? "shifted" : ""}`}>
          {/* Menu lateral quando está no desktop/tablet */}
          <MenuDesktop
            menuOpen={menuOpen}
            setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
          />

          {/* Menu rodapé quando está no mobile */}
          <MenuMobile />

          <main>
            <div className="card-area">
              <h2>Contribuições financeiras</h2>
              <DonationsForm />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
