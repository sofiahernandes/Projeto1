import Link from "next/link";

import userIcon from "@/assets/user.png";
import addIcon from "@/assets/add.png";
import newspaperIcon from "@/assets/newspaper.png";

interface Properties {
  raUsuario: number;
}

export default function MenuMobile({ raUsuario }: Properties) {
  return (
    <nav className="mobile-nav">
      <Link className="w-full" href={`/${raUsuario}/team-history`}>
        <button type="button" className="donation-menu-button">
          <img className="mx-auto" src={newspaperIcon.src} />
        </button>
      </Link>
      <Link className="w-full" href={`/${raUsuario}/new-contribution`}>
        <button type="button" className="donation-menu-button bg-primary!">
          <img className="mx-auto invert" src={addIcon.src} />
        </button>
      </Link>
      <Link className="w-full" href={`/${raUsuario}/user-profile`}>
        <button className="donation-menu-button">
          <img className="mx-auto" src={userIcon.src} />
        </button>
      </Link>
    </nav>
  );
}
