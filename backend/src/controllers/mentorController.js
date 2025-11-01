import bcrypt from "bcrypt";
import { prisma } from "../../prisma/lib/prisma.js";
import { createToken, denyToken } from "../services/tokenServices.js";

const sanitizeMentor = (u) => ({
  IdMentor: u.IdMentor,
  EmailMentor: u.EmailMentor,
  IsAdmin: u.IsAdmin,
  SenhaMentor: u.SenhaMentor,
});
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

  //POST http://localhost:3001/api/createMentor
  createMentor: async (req, res) => {
    const { EmailMentor, RaUsuario } = req.body;

    if (!EmailMentor || !RaUsuario) {
      return res.status(400).json("Preencha todos os campos");
    }
    const hashedPassword = await bcrypt.hash(SenhaMentor, 10);
    try {
      const existing = await prisma.mentor.findUnique({
        where: { EmailMentor },
      });

      if (existing) {
        return res.status(409).json({
          error: "Mentor já cadastrado",
          IdMentor: existing.IdMentor,
        });
      }

      const mentor = await prisma.mentor.create({
        data: {
          EmailMentor,
          SenhaMentor: RaUsuario.toString(),
          IsAdmin: false,
        },
      });
      //para atualizar a tabela de time, e adicionar no time, o id do mentor (que é o que falta quando o time é cadastrado)
      await prisma.time.updateMany({
        where: { RaUsuario },
        data: { IdMentor: mentor.IdMentor },
      });

      res.json(mentor);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao cadastrar mentor", details: err.message });
    }
  },

  //LOGIN http://localhost:3001/api/register/login
  loginMentor: async (req, res) => {
    const { EmailMentor, SenhaMentor } = req.body;
    if (!EmailMentor || !SenhaMentor) {
      return res.status(400).json({ error: "Coloque os campos corretamente" });
    }
    try {
      const mentor = await prisma.findUnique({
        where: { EmailMentor: String(EmailMentor) },
      });
      if (!mentor) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
      const senhaValida = await bcrypt.compare(
      SenhaMentor, 
      mentor.SenhaMentor
      );
      if (!senhaValida) {
        return res
          .status(401)
          .json({ error: "Senha do mentor incorreta, tente novamente." });
      }
      //para procurar no db, na tabela time, o time que esse mentor está alocado (o id delex'')
      const time = await prisma.time.findFirst({
        where: { IdMentor: mentor.IdMentor },
      });

      if (!time) {
        return res
          .status(404)
          .json({ error: "Time não encontrado para este mentor" });
      }
      //res.json({ RaAlunoCriador: mentor.SenhaMentor, IdTime: time.IdTime });
      //MARIAH, revisa essa linha: pra retornar o login do mentor com o RaAlunoCriador (ra do aluno que cadastrou o mentor) e o id time, deixamos essa linha de res json ou a debaixo do token?

      const { token } = createToken({ EmailMentor: mentor.EmailMentor });

      res.json({ token, mentor: sanitizeMentor(mentor) });
    } catch (err) {
      return res
        .status(500)
        .json({
          error: "Erro ao fazer o login do mentor",
          details: err.message,
        });
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
};

export default mentorController;
