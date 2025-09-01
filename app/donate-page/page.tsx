"use client";

import "./donatePage.css";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Donations() {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="container w-full md:mt-20">
      <header>
        <button
          className={`open-menu ${menuOpen ? "menu-icon hidden" : "menu-icon"}`}
          onClick={() => setMenuOpen(true)}
        >
          {" "}
          ☰{" "}
        </button>
      </header>
      <div className="content">
        <div className={`page-container ${menuOpen ? "shifted" : ""}`}>
          {/*Menu lateral quando está no desktop/tablet*/}
          <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
            <button className="close-menu" onClick={() => setMenuOpen(false)}>
              {" "}
              ✖{" "}
            </button>
            <nav>
              <button className="new-donation">
                {" "}
                Cadastrar novas contribuições{" "}
              </button>
              <button className="old-donations">
                {" "}
                Histórico de contribuições{" "}
              </button>
            </nav>
          </aside>

          {/*Menu rodapé quando está no mobile*/}
          <nav className="mobile-nav">
            <button className="new-donation">
              {" "}
              Cadastrar novas contribuições{" "}
            </button>
            <button className="old-donations">
              {" "}
              Histórico de contribuições{" "}
            </button>
          </nav>

          <main>
            <div className="card-area">
              <h2>Contribuições financeiras</h2>
              <form className="donation-details" onSubmit={handleSubmit}>
                <div className="name">
                  <label>Nome do doador/evento:</label>
                  <input
                    placeholder="Ex: Instituto ALMA"
                    type="text"
                    name="name"
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                  />
                </div>

                <div className="date">
                  <label>Data:</label>
                  <div className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="justify-between font-normal"
                        >
                          {date
                            ? date.toLocaleDateString()
                            : "Selecione a data"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id="calendar"
                        className="w-auto overflow-hidden border-[#ccc] p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          defaultMonth={date}
                          selected={date}
                          onSelect={(date) => {
                            setDate(date);
                            setCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="value-donate">
                  <label>Valor arrecadado:</label>
                  <input
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                    placeholder="R$"
                    type="number"
                    name="value-donate"
                  />
                </div>

                <div className="goal">
                  <label>Meta esperada:</label>
                  <input
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                    placeholder="R$"
                    type="number"
                    name="goal"
                  />
                </div>

                <div className="funds">
                  <label>Gastos com evento/organização:</label>
                  <input
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                    placeholder="R$"
                    type="number"
                    name="funds"
                  />
                </div>

                <div className="files">
                  <label>Anexar comprovantes</label>
                  <input
                    className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
                    type="file"
                    name="files"
                  />
                </div>

                <button className="mt-5" type="submit">
                  Cadastrar arrecadação
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
