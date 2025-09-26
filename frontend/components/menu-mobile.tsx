import Link from "next/link";

interface Properties {
  raUsuario: number
}

export default function MenuMobile({raUsuario}: Properties) {
  return (
    <nav className="mobile-nav">
      <Link href={`/(restricted)/${raUsuario}/new-contribution`}><button className="donation-menu-button">Cadastrar novas contribuições</button></Link>
      <Link href={`/(restricted)/${raUsuario}/team-history`}><button className="donation-menu-button">Histórico de contribuições</button></Link>
    </nav>
  );
}
