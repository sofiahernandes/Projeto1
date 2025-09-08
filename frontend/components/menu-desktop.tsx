import { SetStateAction } from "react";
import Link from "next/link";

interface Properties {
  menuOpen: Boolean;
  setMenuOpen: (arg: SetStateAction<boolean>) => void;
}

export default function MenuDesktop({ menuOpen, setMenuOpen }: Properties) {
  return (
    <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
      <button className="close-menu" onClick={() => setMenuOpen(false)}>
        ✖
      </button>
      <nav>
        <Link href="/"><button className="donation-menu-button">Voltar ao Dashboard</button></Link>
        <Link href="/register/new-contribution"><button className="donation-menu-button">Cadastrar novas contribuições</button></Link>
        <Link href="/team-history"><button className="donation-menu-button">Histórico de contribuições</button></Link>
      </nav>
    </aside>
  );
}
