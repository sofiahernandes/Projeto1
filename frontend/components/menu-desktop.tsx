import { SetStateAction } from "react";
import Link from "next/link";

interface Properties {
  menuOpen: Boolean
  setMenuOpen: (arg: SetStateAction<boolean>) => void
  idTime: number
}

export default function MenuDesktop({ menuOpen, setMenuOpen, idTime }: Properties) {
  return (
    <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
      <button className="close-menu" onClick={() => setMenuOpen(false)}>
        ✖
      </button>
      <nav>
        <Link href="/"><button className="donation-menu-button">Voltar ao Dashboard</button></Link>
        <Link href={`/(restricted)/${idTime}/new-contribution`}><button className="donation-menu-button">Cadastrar novas contribuições</button></Link>
        <Link href={`/(restricted)/${idTime}/team-history`}><button className="donation-menu-button">Histórico de contribuições</button></Link>
      </nav>
    </aside>
  );
}
