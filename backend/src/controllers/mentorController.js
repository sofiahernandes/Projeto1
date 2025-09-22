import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mentorController = {
  //GET http://localhost:3001/api/mentors
  allMentors: async (_, res) => {
    const { IdMentor, EmailMentor, IsAdmin, SenhaMentor } = req.params;
    try {
      const mentores = await prisma.mentor.findMany({
        select: {
          IdMentor: IdMentor,
          EmailMentor: EmailMentor,
          IsAdmin: IsAdmin,
          SenhaMentor: SenhaMentor,
        },
      });
      res.json(mentores);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao listar mentores.", details: err.message });
    }
  },
  // try {
  //   const [rows] = await pool.query(
  //     'SELECT * FROM mentor'
  //   )
  //   res.json(rows)
  // } catch (err) {
  //   res.status(500).json({ error: 'Erro ao listar mentores.', details: err.message })
  // }

  //GET http://localhost:3001/api/mentor/id/:IdMentor
  mentorById: async (req, res) => {
    const { IdMentor } = req.params;
    try {
      const mentor = await prisma.mentor.findUnique({
        where: { IdMentor: Number(IdMentor) },
      });

      if (!mentor) {
        return res.status(404).json({ message: "Mentor não encontrado" });
      }

      res.json(mentor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // try {
  //   const [rows] = await pool.query(
  //     "SELECT * FROM mentor WHERE IdMentor=?",
  //     [IdMentor]
  //   )
  //   res.json(rows)
  // } catch (err) {
  //   res.status(500).json({ error: "Mentor não encontrado." })
  // }

  //GET http://localhost:3001/api/mentor/email/:EmailMentor
  mentorByEmail: async (req, res) => {
    const { EmailMentor } = req.params;

    try {
      const mentor = await prisma.mentor.findUnique({
        where: { EmailMentor: String(EmailMentor) },
      });
      res.json(mentor);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao encontrar mentor", details: err.message });
    }
  },
  // try {
  //   const [rows] = await pool.query(
  //     "SELECT * FROM mentor WHERE EmailMentor=?",
  //     [EmailMentor]
  //   )
  //   res.json(rows)
  // } catch (err) {
  //   res.status(500).json({ error: 'Erro ao encontrar mentor', details: err.message });
  // }

  //POST http://localhost:3001/api/createMentor
  createMentor: async (req, res) => {
    const { EmailMentor, IsAdmin, SenhaMentor } = req.body;

    if (!EmailMentor || !SenhaMentor || IsAdmin === undefined) {
      return res.status(400).json("Preencha todos os campos");
    }

    try {
      const mentor = await prisma.mentor.create({
        data: { EmailMentor, IsAdmin: IsAdmin ?? false, SenhaMentor },
      });
      res.json(mentor);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao cadastrar mentor", details: err.message });
    }
  },

  //DELETE http://localhost:3001/api/deleteMentor/:EmailMentor
  deleteMentor: async (req, res) => {
    const { EmailMentor } = req.params;

    try {
      const mentor = await prisma.mentor.delete({
        where: { EmailMentor: EmailMentor },
      });
      res.json({ message: "Mentor deletado com sucesso!", mentor });
    } catch (err) {
      if (err.code == P2025) {
        // quando o prisma não encontra algo ele dá o erro P2025
        res.status(404).json({ error: "Mentor não encontrado." });
      } else {
        res
          .status(500)
          .json({ error: "Erro ao deletar mentor.", details: err.message });
      }
    }
  },
  // try {
  //   const [result] = await pool.query(
  //     "DELETE FROM mentor WHERE EmailMentor=? AND IsAdmin=false",
  //     [EmailMentor]
  //   )
  //   if (result.affectedRows == 0) {
  //     res.status(404).json({ error: "Mentor não encontrado."})
  //   }
  // } catch (err) {
  //   res.status(500).json({ error: "Erro ao deletar mentor.", details: err.message })
  // }
};

export default mentorController;
