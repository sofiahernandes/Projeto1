import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function tryConnection() {
  try {
    
    const newUser = await prisma.usuario.create({
      data: {  RaUsuario: 25027757,
      NomeUsuario:"Analice Coimbra",
      EmailUsuario:"analice.carneiro@edu.fecap",
      SenhaUsuario:"123@projeto01",
      TelefoneUsuario:"1145367282",
      Turma:"1MA",},
    });

    console.log("Usuário criado:", newUser);

    const users = await prisma.usuario.findMany();
    console.log("Usuários no banco:", users);
  } catch (err) {
    console.error("Erro de conexão:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

tryConnection();
