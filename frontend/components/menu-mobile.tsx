import Link from "next/link";

export default function MenuMobile() {
  return (
    <nav className="mobile-nav">
      <Link href="/register/new-contribution"><button className="donation-menu-button">Cadastrar novas contribuições</button></Link>
      <Link href="/team-history"><button className="donation-menu-button">Histórico de contribuições</button></Link>
    </nav>
  );
}
