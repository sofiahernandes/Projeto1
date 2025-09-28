import Link from "next/link";

interface Properties {
  raUsuario: number;
}

export default function MenuMobile({ raUsuario }: Properties) {
  return (
    <nav className="mobile-nav">
      <Link href={`/${raUsuario}/new-contribution`}>
        <button type="button" className="donation-menu-button">
          Cadastrar novas contribuições
        </button>
      </Link>
      <Link href={`/${raUsuario}/team-history`}>
        <button type="button" className="donation-menu-button">
          Histórico de contribuições
        </button>
      </Link>
      <Link href={`/${raUsuario}/user-profile`}><button className="donation-menu-button">Meu perfil</button></Link>

    </nav>
  );
}
