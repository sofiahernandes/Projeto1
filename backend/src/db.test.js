import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function tryConnection() {
  try {
    
    const Alimento = await prisma.alimento.create({
      data: {
        NomeAlimento: "Ervilha enlatado",
        Pontuacao: null
      },
    });

    console.log("Alimento criado:", Alimento);

    const alimento = await prisma.alimento.findMany();
    console.log("Alimentos no banco:", Alimento);
  } catch (err) {
    console.error("Erro de conexão:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

tryConnection();
