"use client";

import "/styles/donatePage.css";
import React, { useState } from "react";
import Link from "next/link";
import { Form } from "react-hook-form";

export default function Donations() {
    const [menuOpen, setMenuOpen] = useState(false)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formDonate = new FormData(e.currentTarget);
      const Donate = {
        name: formDonate.get("name"),
        date: formDonate.get("date"),
        value: formDonate.get("value-donate"),
        goal: formDonate.get("goal"),
        funds: formDonate.get("funds"),
        files: formDonate.get("files"),
      };

      console.log("Dados do formulario", Donate);
      alert("Arrecadação cadastrada! Verifique o console: ");

    };

  return (
    <div> 
    <Link href="/" className="underline text-blue-700 fixed p-4 cursor-pointer">
        <span> Voltar </span>  
    </Link>  

    <div className={`page-container ${menuOpen ? "shifted" : ""}`}>
      <header>
        <button className={`open-menu ${menuOpen ? "hidden" : ""}`} onClick={() => setMenuOpen(true)}> ☰ Menu </button>
        
        <h1 className="page-title">Registro de arrecadações - Arkana</h1>
      </header>

      {/*Menu lateral quando está no desktop/tablet*/}
      <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}> ✖ </button>
        <nav>
            <button className="new-donation"> Cadastrar novas contribuições </button>
            <button className="old-donations"> Histórico de contribuições </button>
        </nav>
      </aside>

      {/*Menu rodapé quando está no mobile*/}
      <nav className="mobile-nav"> 
            <button className="new-donation"> Cadastrar novas contribuições </button>
            <button className="old-donations"> Histórico de contribuições </button>
      </nav>

      <main> 
        <div className="card-area" >
          <h2>Contribuições financeiras</h2>
          <form className="donation-details" onSubmit={handleSubmit}>
            <div className="name">
              <label>Nome do doador/evento:</label>
              <input placeholder="Ex: Instituto ALMA" type="text"  name="name"/>
            </div>

            <div className="date">
              <label>Data:</label>
              <input type="date" name="date" />
            </div>

            <div className="value-donate">
              <label>Valor arrecadado:</label>
              <input placeholder="R$" type="number" name="value-donate" />
            </div>

            <div className="goal">
              <label>Meta esperada:</label>
              <input placeholder="R$" type="number" name="goal" />
            </div>

            <div className="funds">
              <label>Gastos com evento/organização:</label>
              <input placeholder="R$" type="number" name="funds" />
            </div>

            <div className="files">
              <label>Anexar comprovantes</label>
              <input type="file" name="files"/>
            </div>

            <button type="submit">Cadastrar arrecadação</button>
          </form>
        </div>
      </main>
    </div>
    </div>
  );
}
