import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function tryConnection() {
  try {
    
    const Admin = await prisma.mentor.create({
      data: {
        EmailMentor: "",
        SenhaMentor: "",
        IsAdmin: "",
      },
    });

    console.log("Mentor criado:", Admin);

    const admin = await prisma.mentor.findMany();
    console.log("Mentores no banco:", admin);
  } catch (err) {
    console.error("Erro de conexão:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

tryConnection();
