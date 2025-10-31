import { prisma } from "../../prisma/lib/prisma.js";


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
    const {
      NomeTime,
      RaUsuario,
      RaAluno2,
      RaAluno3,
      RaAluno4,
      RaAluno5,
      RaAluno6,
      RaAluno7,
      RaAluno8,
      RaAluno9,
      RaAluno10,
    } = req.body;

    if (
      !NomeTime ||
      !RaAluno2 ||
      !RaAluno3 ||
      !RaAluno4 ||
      !RaAluno5 ||
      !RaAluno6 ||
      !RaAluno7 ||
      !RaAluno8 ||
      RaAluno9 ||
      RaAluno10
    ) {
      return res.status(400).json("Preencha todos os campos");
    }

    try {
      const time = await prisma.time.create({
        data: {
          NomeTime,
          RaUsuario,
          RaAluno2,
          RaAluno3,
          RaAluno4,
          RaAluno5,
          RaAluno6,
          RaAluno7,
          RaAluno8,
          RaAluno9,
          RaAluno10,
        },
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
