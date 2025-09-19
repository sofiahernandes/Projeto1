import Link from "next/link";

interface Properties {
  idTime: number
}

export default function MenuMobile({idTime}: Properties) {
  return (
    <nav className="mobile-nav">
      <Link href={`/(restricted)/${idTime}/new-contribution`}><button className="donation-menu-button">Cadastrar novas contribuições</button></Link>
      <Link href={`/(restricted)/${idTime}/team-history`}><button className="donation-menu-button">Histórico de contribuições</button></Link>
    </nav>
  );
}
