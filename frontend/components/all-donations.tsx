"use client";

import React, { useState } from "react";

interface Properties {
  nomeEvento: string;
  setNomeEvento: React.Dispatch<React.SetStateAction<string>>;
  //metaEvento: number;
  //setMetaEvento: React.Dispatch<React.SetStateAction<number>>; 
}

export default function AllDonations({
  //metaEvento,
  //setMetaEvento,
  nomeEvento,         
  setNomeEvento

}: Properties) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/createContribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //meta: Number(metaEvento),
          nomeEvento: String (nomeEvento),

        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        alert(err?.error || "Erro ao cadastrar contribuição");
        return;
      }

      const data = await res.json();
      alert("Contribuição registrada com sucesso!");
      console.log("Contribuição criada:", data);

      //setMetaEnvento(0);
    } catch (error) {
      console.error("Erro ao enviar contribuição:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
     <input
        className="w-[80%] bg-white border border-[#b4b4b4] rounded-lg text-black placeholder-gray-400 px-3 py-1.5 text-base focus:outline-none"
        type="text"
        placeholder="Nome do evento"
        value={nomeEvento}
        onChange={(e) => setNomeEvento(e.target.value)}
        />
    </form>
  );
}