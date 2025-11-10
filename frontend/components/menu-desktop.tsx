import { SetStateAction, useState, useEffect } from "react";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";

interface Properties {
  menuOpen: Boolean;
  setMenuOpen: (arg: SetStateAction<boolean>) => void;
}

export default function MenuDesktop({ menuOpen, setMenuOpen }: Properties) {
  const params = useParams();
  const [RaUsuario, setRaUsuario] = useState<number | null>(null);

  useEffect(() => {
    if (params?.RaUsuario) {
      setRaUsuario(Number(params?.RaUsuario));
    }
  }, [params]);
  return (
    <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
      <button className="close-menu" onClick={() => setMenuOpen(false)}>
        ✖
      </button>
      <nav>
        <Link href="/">
          <button className="p-2 m-2 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/20 border border-gray-200 shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:!text-black text-base w-55">
            Voltar ao Dashboard
          </button>
        </Link>

        <Link href={`/user/${RaUsuario}/user-profile`}>
          <button className="p-2 m-2 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/20 border border-gray-200 shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:!text-black text-base w-55">
            Meu perfil
          </button>
        </Link>

        <Link href={`/user/${RaUsuario}/new-contribution`}>
          <button className="p-2 m-2 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/20 border border-gray-200 shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:!text-black text-base w-55">
            Cadastrar novas contribuições
          </button>
        </Link>

        <Link href={`/user/${RaUsuario}/team-history`}>
          <button className="p-2 m-2 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/20 border border-gray-200 shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:!text-black text-base w-55">
            Histórico de contribuições
          </button>
        </Link>
      </nav>
    </aside>
  );
}
