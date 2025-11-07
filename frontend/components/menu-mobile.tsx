"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";


import homeDefault from "@/assets/icons/home.png";
import homeActive from "@/assets/icons/home-active.png";
import homePressed from "@/assets/icons/home-pressed.png";


import addDefault from "@/assets/icons/add.png";
import addActive from "@/assets/icons/add-active.png";
import addPressed from "@/assets/icons/add-pressed.png";

import historyDefault from "@/assets/icons/history.png";
import historyActive from "@/assets/icons/history-active.png";
import historyPressed from "@/assets/icons/history-pressed.png";

interface Properties {
  RaUsuario: number;
}

export default function MenuMobile({ RaUsuario }: Properties) {
  const pathname = usePathname();
  const router = useRouter();

  const homeHref = `/user/${RaUsuario}/team-history`;
  const createHref = `/user/${RaUsuario}/new-contribution`;
  const historyHref = `/user/${RaUsuario}/user-profile`;

  const isActive = (href: string) => pathname?.startsWith(href);

  useEffect(() => {
    if (
      RaUsuario === undefined ||
      RaUsuario === null ||
      Number.isNaN(Number(RaUsuario))
    ) {
      console.warn("MenuMobile: RaUsuario inválido", { RaUsuario, pathname });
    }
  }, [RaUsuario, pathname]);

  const onCreateClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (isActive(createHref)) {
      e.preventDefault();
      router.refresh();
    }
  };

  // ---------- Estilos base ----------
  const basePill =
    "relative flex items-center justify-center h-10 w-16 rounded-lg transition-all duration-300 ease-out";
  const neutralPill = "bg-transparent text-[#70805A] hover:bg-[#8FA17D]";
  const activePill = "bg-[#8FA17D] text-white border border-[#8FA17D]";

  // ---------- Ícones ----------
  const icons = useMemo(
    () => ({
      home: { default: homeDefault, active: homeActive, pressed: homePressed },
      add: { default: addDefault, active: addActive, pressed: addPressed },
      history: {
        default: historyDefault,
        active: historyActive,
        pressed: historyPressed,
      },
    }),
    []
  );

  // ---------- Efeito "pop" ----------
  const [pressed, setPressed] = useState<{ [key: string]: boolean }>({});
  const timersRef = useRef<{ [key: string]: number }>({});

  const triggerPress = (key: string) => {
    if (timersRef.current[key]) window.clearTimeout(timersRef.current[key]);
    setPressed((p) => ({ ...p, [key]: true }));
    timersRef.current[key] = window.setTimeout(() => {
      setPressed((p) => ({ ...p, [key]: false }));
    }, 150);
  };

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // ---------- Escolher ícone ----------
  const getIconSrc = (
    set: { default: any; active: any; pressed?: any },
    isTabActive: boolean,
    isPressed: boolean
  ) => {
    if (isPressed && set.pressed) return set.pressed;
    if (isTabActive) return set.active;
    return set.default;
  };

  // ---------- JSX ----------
  return (
    <nav
      role="navigation"
      aria-label="Menu mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-3"
    >
      <style jsx global>{`
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.12);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pop {
          animation: pop 150ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pop {
            animation: none !important;
          }
          .transition-all {
            transition: none !important;
          }
        }
      `}</style>

      <div className="mx-auto px-48">
        <div className="flex justify-center gap-16 py-2 bg-[#A6B895] rounded-[30px]">
          {/* Aba 1: Home */}
          <Link
            href={homeHref}
            aria-label="Início"
            className={`${basePill} ${isActive(homeHref) ? activePill : neutralPill} ${
              pressed.home ? "animate-pop" : ""
            }`}
            onMouseDown={() => triggerPress("home")}
            onTouchStart={() => triggerPress("home")}
          >
            <Image
              src={getIconSrc(icons.home, isActive(homeHref), !!pressed.home)}
              alt="Início"
              width={24}
              height={24}
              className="pointer-events-none select-none"
              draggable={false}
              priority
            />
          </Link>

          {/* Aba 2: Cadastrar */}
          <Link
            href={createHref}
            aria-label="Cadastrar"
            onClick={onCreateClick}
            className={`${basePill} ${
              isActive(createHref) ? activePill : neutralPill
            } ${pressed.add ? "animate-pop" : ""}`}
            onMouseDown={() => triggerPress("add")}
            onTouchStart={() => triggerPress("add")}
          >
            <Image
              src={getIconSrc(icons.add, isActive(createHref), !!pressed.add)}
              alt="Cadastrar"
              width={24}
              height={24}
              className="pointer-events-none select-none"
              draggable={false}
              priority
            />
          </Link>

          {/* Aba 3: Histórico */}
          <Link
            href={historyHref}
            aria-label="Histórico"
            className={`${basePill} ${
              isActive(historyHref) ? activePill : neutralPill
            } ${pressed.history ? "animate-pop" : ""}`}
            onMouseDown={() => triggerPress("history")}
            onTouchStart={() => triggerPress("history")}
          >
            <Image
              src={getIconSrc(
                icons.history,
                isActive(historyHref),
                !!pressed.history
              )}
              alt="Histórico"
              width={24}
              height={24}
              className="pointer-events-none select-none"
              draggable={false}
              priority
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
