import React from "react";

import CalendarPopover from "@/components/calendar-popover";
import CustomInput from "./custom-input";

export default function DonationsForm() {
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
    <form className="donation-details" onSubmit={handleSubmit}>
      <div className="name">
        <label>Nome do doador/evento:</label>
        <CustomInput placeholder={"Ex: Instituto ALMA"} type={"text"} name={"name"} />
      </div>

      <div className="date">
        <label>Data:</label>
        <div className="block w-full bg-[white] border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none">
          <CalendarPopover />
        </div>
      </div>

      <div className="value-donate">
        <label>Valor arrecadado:</label>
        <CustomInput placeholder={"R$"} type={"number"} name={"value-donate"} />
      </div>

      <div className="goal">
        <label>Meta esperada:</label>
        <CustomInput placeholder={"R$"} type={"number"} name={"goal"} />
      </div>

      <div className="funds">
        <label>Gastos com evento/organização:</label>
        <CustomInput placeholder={"R$"} type={"number"} name={"funds"} />
      </div>

      <div className="files">
        <label>Anexar comprovantes</label>
        <CustomInput placeholder={""} type={"file"} name={"files"} />
      </div>

      <button className="mt-5" type="submit">
        Cadastrar arrecadação
      </button>
    </form>
  );
}
