import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface Properties {
  menuOpen: Boolean;
  setMenuOpen: (arg: SetStateAction<boolean>) => void;
}

export default function MenuDesktopAdmin({
  menuOpen,
  setMenuOpen,
}: Properties) {
  const params = useParams();
  const [IdMentor, setIdMentor] = useState<string | null>(null);

  useEffect(() => {
    if (params?.IdMentor) {
      setIdMentor(params.IdMentor as string);
    }
  }, [params]);

  if (!IdMentor) {
    return (
      <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>
          ✖
        </button>
        <nav>
          <p>Carregando...</p>
        </nav>
      </aside>
    );
  }

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

        <Link href={`/admin/${IdMentor}/admin-profile`}>
          <button className="p-2 m-2 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/20 border border-gray-200 shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:!text-black text-base w-55">
            Meu perfil
          </button>
        </Link>

        <Link href={`/admin/${IdMentor}/admin-history`}>
          <button className="p-2 m-2 rounded-xl bg-[#f4f3f1]/80 hover:bg-[#cc3983]/20 border border-gray-200 shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:!text-black text-base w-55">
            Histórico de contribuições
          </button>
        </Link>
      </nav>
    </aside>
  );
}
