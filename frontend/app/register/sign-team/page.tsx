"use client";
import React from "react";
import { useRouter } from "next/navigation";
import TeamTabs from "@/components/tabs-team";

export default function TeamSign() {
  const router = useRouter();
  const [NomeTime] = React.useState("");
  const [RaAluno2] = React.useState("");
  const [RaAluno3] = React.useState("");
  const [RaAluno4] = React.useState("");
  const [RaAluno5] = React.useState("");
  const [RaAluno6] = React.useState("");
  const [RaAluno7] = React.useState("");
  const [RaAluno8] = React.useState("");
  const [RaAluno9] = React.useState("");
  const [RaAluno10] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não está configurada");
      alert("Erro de configuração. Entre em contato com o suporte.");
      return;
    }

    const apiUrl = backendUrl.endsWith("/")
      ? `${backendUrl}api/createTeam`
      : `${backendUrl}/api/createTeam`;

    console.log("Tentando conectar em:", apiUrl);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NomeTime: NomeTime,
          RaAluno2: RaAluno2,
          RaAluno3: RaAluno3,
          RaAluno4: RaAluno4,
          RaAluno5: RaAluno5,
          RaAluno6: RaAluno6,
          RaAluno7: RaAluno7,
          RaAluno8: RaAluno8,
          RaAluno9: RaAluno9,
          RaAluno10: RaAluno10,
        }),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro da API:", err);
        alert("Erro: " + (err.error || `Status ${res.status}`));
        return;
      }

      const newUser = await res.json();
      console.log("Time cadastrado:", newUser);

      alert("Usuário e time cadastrados com sucesso!");

      router.push(`/$/new-contribution?userId=${newUser.RaUsuario}`);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        alert(
          "Erro de conexão. Verifique se o backend está rodando e se a URL está correta."
        );
      } else {
        alert("Erro ao cadastrar usuário: " + error);
      }
    }
  };
  return (
    <section>
      <TeamTabs />
    </section>
  );
}
