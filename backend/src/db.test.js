import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function tryConnection() {
  try {
    
    const senhaPura = "arkana";
    const senhaHash = await bcrypt.hash(senhaPura, 10); 

    // Cria o mentor com senha criptografada
    const Mentor = await prisma.mentor.create({
      data: {
        EmailMentor: "admin@Deteste",
        IsAdmin: true,
        SenhaMentor: senhaHash, // senha criptografada
      },
    });

    console.log("Usuário criado:", Mentor);

    const mentor = await prisma.mentor.findMany();
    console.log("Usuários no banco:", mentor);
  } catch (err) {
    console.error("Erro de conexão:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

tryConnection();
