interface Team {
  NomeTime: string
  RaUsuario: number
  RaAluno2: number
  RaAluno3: number
  RaAluno4: number
  RaAluno5: number
  RaAluno6: number
  RaAluno7: number
  RaAluno8: number
  RaAluno9: number
  RaAluno10: number
  IdMentor: number
}

interface User {
  RaUsuario: number
  NomeUsuario: string
  TurmaUsuario: string
}

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL

export async function fetchData(RaUsuario: number, IdMentor: number): Promise<{ team: Team; user: User } | undefined> {
  try {
    const res = await fetch(`${backend_url}/api/${RaUsuario}/userTeam`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  
    const teamRes = await fetch(`${backend_url}/api/mentor/${IdMentor}/team`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const userRes = await fetch(`${backend_url}/api/user/${RaUsuario}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: "Erro desconhecido" }));
      alert("Erro ao buscar time: " + (errData.message || errData.error || "Erro desconhecido"));
      return undefined;
    }

    if (!teamRes.ok){
      const errData = await res.json().catch(() =>({message:"Erro ao buscar time do mentor"}));
      alert("Erro ao buscar time: " + (errData.message || errData.error || "Erro desconhecido"));

    }
    if (!userRes.ok) {
      const errData = await userRes.json().catch(() => ({ message: "Erro desconhecido" }));
      alert("Erro ao buscar usuário: " + (errData.message || errData.error || "Erro desconhecido"));
      return undefined;
    }

    const team = await res.json();
    const mentor = await res.json()
    const user = await userRes.json();

    return { team, user };
    
  } catch (error) {
    console.error("Erro na requisição:", error);
    return undefined;
  }
}