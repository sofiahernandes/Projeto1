"use client";

import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MenuMobile() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [RaUsuario, setRaUsuario] = useState<number>();

  const homeHref = `/user/${RaUsuario}/team-history`;
  const createHref = `/user/${RaUsuario}/new-contribution`;
  const historyHref = `/user/${RaUsuario}/user-profile`;

  const isActive = (href: string) => pathname?.startsWith(href);

  useEffect(() => {
    if (params?.RaUsuario){
      setRaUsuario(Number(params?.RaUsuario))
    }
  }, [RaUsuario, pathname]);

  const onCreateClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (isActive(createHref)) {
      e.preventDefault();
      router.refresh();
    }
  };

  // Estilos base dos "pills"
  const basePill =
    "relative flex items-center px-4 justify-center h-12 rounded-[40px] border-transparent transition-all duration-300 ease-out will-change-transform will-change-auto";

  // Neutral (não selecionado)
  const neutralPill =
    "bg-[#A6B895] text-white hover:bg-[#F2D1D4] active:scale-95";

  // Selecionado: ícone rosa + halo/anel verde claro + leve scale
  const activePill =
    "bg-[#70805A] text-white ring-2 ring-[#6B7E5D] ring-offset-2 ring-offset-white animate-selected-pop";

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0 z-40
        pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-3
      "
      role="navigation"
      aria-label="Menu mobile"
    >
      <div className="mx-auto max-w-lg px-4">
        <div
          className="
            grid grid-cols-3 gap-2
            p-2 
            bg-[#A6B895]
            rounded-[30px]   
          "
        >
          <Link
            href={homeHref}
            aria-label="Início"
            className={`${basePill} ${
              isActive(homeHref) ? activePill : neutralPill
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5 12 3l9 7.5M5 10v10a1 1 0 0 0 1 1h4.5a.5.5 0 0 0 .5-.5V15a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v6.5a.5.5 0 0 0 .5.5H18a1 1 0 0 0 1-1V10"
              />
            </svg>
          </Link>

          <Link
            href={createHref}
            aria-label="Cadastrar"
            onClick={onCreateClick}
            className={`${basePill} ${
              isActive(createHref)
                ? activePill
                : "text-white border-transparent hover:bg-[#466C4D] active:scale-95"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </Link>

          <Link
            href={historyHref}
            aria-label="Histórico"
            className={`${basePill} ${
              isActive(historyHref) ? activePill : neutralPill
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
