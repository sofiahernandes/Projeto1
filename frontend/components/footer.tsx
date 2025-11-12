/* eslint-disable complexity */
import Link from "next/link";
import React from "react";

import { Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const pages = [
    { id: 1, text: "Página Inicial", url: "/" },
    { id: 2, text: "Registrar Doações", url: "/register/login" },
    { id: 3, text: "Relatórios Completos", url: "/public-reports" },
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          <div className="flex flex-col gap-2 items-center md:items-start">
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

          <div className="flex flex-col gap-2 items-center">
            <p className="font-bold">Navegue pelo Arkana</p>
            {pages.map((item) => (
              <Link key={item.id} href={item.url} className="hover:opacity-50">
                {item.text}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 items-center md:items-end">
            <p className="font-bold">Nos siga nas redes</p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  className="hover:opacity-50"
                  aria-label={link.type}
                >
                  {link.type === "Instagram" ? (
                    <Instagram />
                  ) : link.type === "Linkedin" ? (
                    <Linkedin />
                  ) : (
                    <Youtube />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-xs opacity-70">
          <Link href="https://github.com/2025-2-MCC2/Projeto1">
            © 2025 Arkana. Todos os direitos reservados.
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
