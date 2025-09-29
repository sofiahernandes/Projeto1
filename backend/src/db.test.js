import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function tryConnection() {
  try {
    
    const newUser = await prisma.usuario.create({
      data: {  RaUsuario: 25027757,
      NomeUsuario:"",
      EmailUsuario:"",
      SenhaUsuario:"",
      TelefoneUsuario:"",
      Turma:"",},
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
