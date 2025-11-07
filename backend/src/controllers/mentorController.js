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

  mentorByTeam: async (req, res) => {
    const { IdMentor } = req.params;

    try {
      const mentor = await prisma.mentor.findUnique({
        where: {
          IdMentor: parseInt(IdMentor),
        },
        include: {
          time: {
            select: {
              IdTime: true,
              NomeTime: true,
              time_usuarios: {
                select: {
                  RaUsuario: true,
                },
              },
            },
          },
        },
      });

      if (!mentor) {
        return res.status(404).json({ error: "Mentor não encontrado" });
      }

      const timesFormatados = mentor.time.map((time) => ({
        IdTime: time.IdTime,
        NomeTime: time.NomeTime,
        RaUsuario: time.time_usuarios[0]?.RaUsuario || null,
      }));

      res.json(timesFormatados);
    } catch (err) {
      console.error("Erro ao buscar times do mentor:", err);
      res.status(500).json({ error: "Erro ao buscar times do mentor" });
    }
  },

  //POST http://localhost:3001/api/createMentor/:RaUsuario
  createMentor: async (req, res) => {
    const { EmailMentor, RaUsuario } = req.body;

    if (!EmailMentor) {
      return res.status(400).json({
        error: "Preencha o campo do email mentor",
        received: { EmailMentor },
      });
    }
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
          SenhaMentor: String(RaUsuario),
          IsAdmin: false,
        },
      });
      //busca o time onde o usuario está alocado pelo time
      const timeUsuario = await prisma.time_Usuario.findFirst({
        where: { RaUsuario: Number(RaUsuario) },
        include: { time: true },
      });

      // atualiza a tabela do time com o mentor
      const updatedTime = await prisma.time.update({
        where: { IdTime: timeUsuario.IdTime },
        data: {
          mentor: { connect: { IdMentor: mentor.IdMentor } },
        },
      });

      res.json({ success: true, time: updatedTime, mentor });
    } catch (err) {
      console.error("Erro detalhado:", err);
      res.status(500).json({
        error: "Erro ao cadastrar mentor",
        details: err.message,
      });
    }
  },

  //LOGIN http://localhost:3001/api/register/login
  loginMentor: async (req, res) => {
    const { EmailMentor, SenhaMentor } = req.body;
    if (!EmailMentor || !SenhaMentor) {
      return res.status(400).json({ error: "Coloque os campos corretamente" });
    }
    try {
      const mentor = await prisma.mentor.findUnique({
        where: { EmailMentor: String(EmailMentor) },
      });

      if (!mentor) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
      if (mentor.SenhaMentor !== String(SenhaMentor)) {
        return { error: "Senha incorreta" };
      }

      const time = await prisma.time.findFirst({
        where: { IdMentor: mentor.IdMentor },
      });

      if (!time) {
        return res
          .status(404)
          .json({ error: "Time não encontrado para este mentor" });
      }
      //res.json({ RaAlunoCriador: mentor.SenhaMentor, IdTime: time.IdTime });
      const { token } = createToken({ EmailMentor: mentor.EmailMentor });
      res.json({ token, mentor: sanitizeMentor(mentor) });
    } catch (err) {
      return res.status(500).json({
        error: "Erro ao fazer o login do mentor",
        details: err.message,
      });
    }
  },

  //POST http://localhost:3001/api/createAdmin
  createAdmin: async (req, res) => {
    const { EmailMentor, SenhaMentor } = req.body;

    if (!EmailMentor || !SenhaMentor) {
      return res.status(400).json("Preencha todos os campos");
    }
    try {
      const hashedPassword = await bcrypt.hash(SenhaMentor, 10);
      const admin = await prisma.mentor.create({
        data: {
          EmailMentor,
          SenhaMentor: hashedPassword,
          IsAdmin: true,
        },
      });

      res.json({ admin });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao cadastrar admin", details: err.message });
    }
  },

  //LOGIN http://localhost:3001/api/register/login
  loginAdmin: async (req, res) => {
    const { EmailMentor, SenhaMentor } = req.body;

    if (!EmailMentor || !SenhaMentor) {
      return res.status(400).json({ error: "Coloque os campos corretamente" });
    }

    try {
      const admin = await prisma.mentor.findUnique({
        where: { EmailMentor },
      });
      if (!admin) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
      const senhaValida = await bcrypt.compare(SenhaMentor, admin.SenhaMentor);
      if (!senhaValida) {
        return res
          .status(401)
          .json({ error: "Senha incorreta, tente novamente." });
      }
      const { token } = createToken({ EmailMentor: admin.EmailMentor });
      res.json({ token, admin: sanitizeMentor(admin) });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Erro ao fazer login.", details: err.message });
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
