/* eslint-disable complexity */
import Link from "next/link";
import React from "react";

import { Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const pages = [
    { id: 1, text: "Página Inicial", url: "/" },
    { id: 2, text: "Registrar Doações", url: "/register/login" },
    { id: 3, text: "Relatórios Completos", url: "/public-reports" },
    { id: 4, text: "Sobre Nós", url: "/about-us" },
  ];
  const socialLinks = [
    {
      id: 1,
      type: "Instagram",
      url: "https://www.instagram.com/liderancasempaticas",
    },
    {
      id: 2,
      type: "Linkedin",
      url: "https://www.linkedin.com/company/projeto-lideran%C3%A7as-emp%C3%A1ticas/?viewAsMember=true",
    },
    {
      id: 3,
      type: "Youtube",
      url: "https://www.youtube.com/@Lideran%C3%A7asEmp%C3%A1ticas",
    },
  ];

  return (
    <>
      <footer className="pt-10 md:pt-20 bg-secondary/20 text-black px-10">
        <div className="max-w-7xl mx-auto gap-y-10 lg:gap-5 grid grid-cols-2 lg:grid-cols-12">
          <div className="col-span-2 md:col-span-4 lg:mr-[25%]">
            <p className="font-bold">Entre em contato</p>
            <form className="flex items-end relative">
              <input
                className="border border-black/70 placeholder:text-black/70 rounded-lg p-2 my-2"
                aria-placeholder="Seu email"
                type="text"
                placeholder="Seu email"
              />
            </form>
          </div>

          <div className="col-span-2 md:col-span-4 grid grid-cols-1">
            <div className="flex flex-col gap-1">
              <p className="font-bold">Navegue pelo Arkana</p>
              {pages?.map((item) => (
                <Link
                  key={`secondColumn-${item.id}`}
                  href={String(item.url)}
                  className="hover:opacity-50 transition-opacity mb-1"
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-2 md:col-span-4 grid grid-cols-1">
            <div className="w-full md:w-auto flex flex-col gap-1">
              <p className="font-bold">Nos siga nas redes</p>
              <div className="w-full md:w-auto flex items-end gap-4 mb-8">
                {socialLinks?.map((link) => (
                  <Link
                    key={`socialLinks-${link.id}`}
                    href={link.url}
                    className="hover:opacity-50 transition-opacity"
                    aria-label={link.type}
                  >
                    {link.type == "Instagram" ? (
                      <Instagram />
                    ) : link.type == "Linkedin" ? (
                      <Linkedin />
                    ) : (
                      <Youtube />
                    )}
                  </Link>
                ))}
              </div>

              <div className="w-full md:w-auto flex flex-col gap-1">
                <p className="font-bold">Conheça as criadoras do Arkana</p>
                <Link
                  className="hover:opacity-50"
                  href="https://github.com/AnaliceCoimbra/"
                >
                  <p>Analice Coimbra Carneiro</p>
                </Link>
                <Link
                  className="hover:opacity-50"
                  href="https://github.com/alicelobwp"
                >
                  <p>Mariah Alice Pimentel Lôbo Pereira</p>
                </Link>
                <Link
                  className="hover:opacity-50"
                  href="https://github.com/sofiahernandes"
                >
                  <p>Sofia Botechia Hernandes</p>
                </Link>
                <Link
                  className="hover:opacity-50"
                  href="https://github.com/viick04"
                >
                  <p>Victória Duarte Vieira Azevedo</p>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 mb-5 col-span-full text-center order-last md:order-none flex flex-col md:flex-row items-center gap-5 justify-center">
            <div className="bottom-links flex gap-5 text-xs">
              <Link
                href="https://github.com/2025-2-MCC2/Projeto1"
                className="opacity-50 transition-all duration-200 hover:underline hover:underline-offset-2"
              >
                © 2025 Arkana. Todos os direitos reservados.
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
