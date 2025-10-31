interface Team {
  NomeTime: string
  RaUsuario: number
  RaAlunos: string
  IdMentor: number
}

interface User {
  NomeUsuario: string
  Turma: string
}

export async function fetchData(userId: number): Promise<{ team: Team; user: User } | undefined> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("NEXT_PUBLIC_BACKEND_URL não está configurada");
      alert("Erro de configuração. Entre em contato com o suporte.");
      return;
    }

    const userApiUrl = `${backendUrl}/api/user/${userId}`;
    const teamApiUrl = `${backendUrl}/api/team/${userId}`;

    try {
      const userRes = await fetch(userApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const teamRes = await fetch(teamApiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!userRes.ok || !teamRes.ok) {
        const err = userRes && teamRes
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        console.error("Erro da API:", err);
        alert("Erro: " + (err));
        return;
      }
      
      const Team = await teamRes.json();
      const User = await userRes.json();

      return { user: User, team: Team };

    } catch (error) {
      console.error("Erro ao encontrar usuário:", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        alert(
          "Erro de conexão. Verifique se o backend está rodando e se a URL está correta."
        );
      } else {
        alert("Erro ao encontrar usuário: " + error);
      }
    }
}
