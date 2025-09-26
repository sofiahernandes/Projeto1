import { PrismaClient } from "@prisma/client";

{ /* 2° Entrega: {IdTime, RaAlunoM, RA1, RA2, RA3, RA4, RA5, RA6, RA7, RA8, RA9, RA10} */}
const prisma = new PrismaClient();

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
  // try {
  //   const [rows] = await pool.query("SELECT * FROM times");
  //   res.json(rows);
  // } catch (err) {
  //   res.status(500).json({ error: "Erro ao buscar times" });
  // }

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
  // try {
  //   const [rows] = await pool.query("SELECT * FROM time WHERE IdTime=?", [
  //     IdTime,
  //   ]);
  //   res.json(rows);
  // } catch (err) {
  //   res.status(500).json({ error: "Time não encontrado" });
  // }

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
  // try {
  //   const [insert] = await pool.query(
  //     "INSERT INTO time (NomeTime, RaUsuario, RaAlunos) VALUES (?,?,?)",
  //     [NomeTime, RaUsuario, RaAlunos]
  //   );
  //   const [rows] = await pool.query("SELECT * FROM time where IdTime=?", [
  //     insert.insertId,
  //   ]);
  // } catch (err) {
  //   res
  //     .status(500)
  //     .json({ error: "Erro ao criar time", details: err.message });
  // }

  //DELETE http://localhost:3001/api/deleteTeam/:IdTime
  deleteTeam: async (req, res) => {
    const { IdTime } = req.params;
    try {
      const time = await prisma.time.delete({
        where: { IdTime: IdTime },
      });
      res.json({ message: "Time deletado com sucesso!", time });
    } catch (err) {
      if (err.code == P2025) {
        return res.status(404).json({ error: "Time não encontrado" });
      } else {
        res.status(500).json({ error: "Erro ao deletar time." });
      }
    }
  },
};
// try {
//   const [result] = await pool.query("DELETE FROM time WHERE IdTime=?", [
//     IdTime,
//   ]);
//   if (result.affectedRows === 0) {
//     return res.status(404).json({ error: "Time não encontrado" });
//   }
//   res.json({ message: "Time deletado com sucesso!" });
// } catch (err) {
//   res.status(500).json({ error: "Erro ao deletar time." });
// }
export default teamsController;
