import { pool } from "../db.js";

{/* 2° Entrega: {IdTime, RaAlunoM, RA1, RA2, RA3, RA4, RA5, RA6, RA7, RA8, RA9, RA10} */}

const teamsController = {
  //GET http://localhost:3001/api/teams
  allTeams: async (_, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM times");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar times" });
    }
  },

  //GET http://localhost:3001/api/team/:IdTime
  teamByID: async (req, res) => {
    const { IdTime } = req.params;
    try {
      const [rows] = await pool.query("SELECT * FROM times WHERE IdTime=?", [
        IdTime,
      ]);
      res.json(rows);
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
      const [insert] = await pool.query(
        "INSERT INTO times (NomeTime, RaUsuario, RaAlunos) VALUES (?,?,?)",
        [NomeTime, RaUsuario, RaAlunos]
      );
      const [rows] = await pool.query("SELECT * FROM times where IdTime=?", [
        insert.insertId,
      ]);
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
      const [result] = await pool.query("DELETE FROM times WHERE IdTime=?", [
        IdTime,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Time não encontrado" });
      }
      res.json({ message: "Time deletado com sucesso!" });
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar time." });
    }
  },
};

export default teamsController;
