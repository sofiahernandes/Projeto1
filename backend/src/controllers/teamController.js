import { prisma } from "../../prisma/lib/prisma.js";

{ /* 2° Entrega: {IdTime, RaAlunoM, RA1, RA2, RA3, RA4, RA5, RA6, RA7, RA8, RA9, RA10} */}

const teamsController = {
  //GET http://localhost:3001/api/teams
  allTeams: async (_, res) => {
    try {
      const times = await prisma.time.findMany();
      res.json(times);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar times", details: err.message });
    }
  },

  //GET http://localhost:3001/api/team/:IdTime
  teamByID: async (req, res) => {
    const { IdTime } = req.params;
    try {
      const time = await prisma.time.findUnique({
        where: { IdTime: Number(IdTime) },
      });
      if (!time) {
        return res.status(404).json({ message: "Time não encontrado" });
      }
      res.json(time);
    } catch (err) {
      res.status(500).json({ error: "Time não encontrado" });
    }
  },
  //GET http://localhost:3001/api/team/:RaUsuario
  teamByUserRA: async (req, res) => {
    const { RaUsuario } = req.params;
    try {
      const time = await prisma.time.findUnique({
        where: { RaUsuario: Number(RaUsuario) },
      });
      if (!time) {
        return res.status(404).json({ message: "Time não encontrado" });
      }

      res.json(time);
    } catch (err) {
      res.status(500).json({ error: "Time não encontrado" });
    }
  },

  //POST http://localhost:3001/api/createTeam
  createTeam: async (req, res) => {
    const { NomeTime, RaUsuario, RaAlunos } = req.body;

    if (!NomeTime || !RaUsuario || !RaAlunos) {
      return res.status(400).json("Preencha todos os campos");
    }

    try {
      const time = await prisma.time.create({
        data: { NomeTime, RaUsuario, RaAlunos },
      });
      res.json(time);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar time", details: err.message });
    }
  },

  //DELETE http://localhost:3001/api/deleteTeam/:IdTime
  deleteTeam: async (req, res) => {
    const { IdTime } = req.params;
    try {
      const time = await prisma.time.delete({
        where: { IdTime: Number(IdTime) },
      });
      res.json({ message: "Time deletado com sucesso!", time });
    } catch (err) {
      if (err.code == "P2025") {
        return res.status(404).json({ error: "Time não encontrado" });
      } else {
        res.status(500).json({ error: "Erro ao deletar time." });
      }
    }
  },
};

export default teamsController;
