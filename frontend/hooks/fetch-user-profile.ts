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
    try {
      const res = await fetch(`http://localhost:3001/api/team/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const userRes = await fetch(`http://localhost:3001/api/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok || !userRes.ok) {
        const err = await res.json();
        alert("Erro: " + err.error);
        return;
      }

      const team = await res.json();
      const user = await userRes.json();

      console.log("Time:", team);
      console.log("Aluno Mentor:", user);

      return { team, user };
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar time.");
    }
  }
