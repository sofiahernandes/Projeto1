import { pool } from "../db.js"

const teamController = {
  allTeams: async (_, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM team"
      )
      res.json(rows)
    } catch (err) {
      res.status(500).json({ err: "Erro ao listar times.", details: err.message })
    }
  },

  teamByID: async (req, res) => {
    const { IdTime } = req.params;

    try {
      const [rows] = await pool.query(
        "SELECT FROM time WHERE IdTime=?",
        [IdTime]
      )
      res.json(rows)
    } catch (err) {
      res.status(500).json({ error: "Time não encontrado.", details: err.message })
    }
  },

  createTeam: (req, res) => {
    const { SemestreEdicao, NomeTime } = req.body;

    if (
      !SemestreEdicao ||
      !NomeTime
    ) {
      return req.status(400).json("Preencha todos os campos");
    }


  },

  deleteTeam: (req, res) => {
    const { IdTime } = req.params;

    
  },
};

export default teamController;
