"use client";

import { SetStateAction, useState } from "react";
import MenuDesktop from "@/components/menu-desktop";
import MenuMobile from "@/components/menu-mobile";
import DonationsForm from "@/components/donations-form";
import BackHome from "@/components/back-home";
import { useParams } from "next/navigation";

export default function Donations() {
  const params = useParams();
  const userId = Number(params.userId);
  const [menuOpen, setMenuOpen] = useState(false);

    const [raUsuario, setRaUsuario] = useState<number | undefined>(userId);
    const [tipoDoacao, setTipoDoacao] = useState("");
    const [quantidade, setQuantidade] = useState<number>();
    const [fonte, setFonte] = useState("");
    const [meta, setMeta] = useState<number>();
    const [gastos, setGastos] = useState<number>();
    const [comprovante, setComprovante] = useState("");

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
            raUsuario={raUsuario!}
            setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
          />

          {/* Menu rodapé quando está no mobile */}
          <MenuMobile 
            raUsuario={raUsuario!}
            // idTime={idTime!} 
          />

          <main>
            <div className="card-area">
              <h2>Contribuições financeiras</h2>
              <DonationsForm
                raUsuario={raUsuario!}
                setRaUsuario={setRaUsuario}
                tipoDoacao={tipoDoacao}
                setTipoDoacao={setTipoDoacao}
                quantidade={quantidade!}
                setQuantidade={setQuantidade}
                fonte={fonte}
                setFonte={setFonte}
                meta={meta!}
                setMeta={setMeta}
                gastos={gastos!}
                setGastos={setGastos}
                comprovante={comprovante}
                setComprovante={setComprovante}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
