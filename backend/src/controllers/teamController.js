import { pool } from "../db.js";

//GET http://localhost:3000/api/teams
const teamsController = {
  allTeams: async (_, res) => {
     try{
      const [rows] = await pool.query(
        'SELECT * FROM times'
      )
      res.json(rows)
     } catch(err) {
      res.status(500).json({error: 'Erro ao buscar times'})
     } 
  },

  //GET http://localhost:3000/api/team/:idTime

  teamByID: async (req, res) => {
    const { idTime } = req.params;
    try {
      const [rows] = await pool.query(
        'SELECT * FROM times WHERE idTime=?',
        [idTime]
      )
      res.json(rows)
    }catch(err) {
      res.status(500).json({ error: "Time não encontrado"})

    }
    
  },

  //POST http://localhost:3000/api/createTeam

  createTeam: async (req, res) => {
    const { NomeTime, IdMentor, RaAlunoM, NomeAlunos, RaAlunos } = req.body;

    if (
      // !idTime ||
      !NomeTime ||
      // !IdMentor ||
      // !RaAlunoM ||
      !NomeAlunos ||
      !RaAlunos
    ) {
      return res.status(400).json("Preencha todos os campos");
    }

    try{
      const [insert] = await pool.query(
        'INSERT INTO times (NomeTime, NomeAlunos, RaAlunos) VALUES (?,?,?)',
        [ NomeTime, NomeAlunos, RaAlunos]
      )
      const [rows] = await pool.query(
        'SELECT * FROM times where IdTime=?',
        [insert.insertId]
      )
    }catch(err) {
      res.status(500).json({ error: 'Erro ao criar time', details: err.message });

    }
  },
  //DELETE http://localhost:3000/api/deleteTeam/:IdTime

  deleteTeam: async (req, res) => {
    const { IdTime } = req.params;

    try{ 
      const [result] = await pool.query(
        'DELETE FROM times WHERE IdTime=?',
        [IdTime]
      )
      if (result.affectedRows === 0) {
        return res.status(404).json({error: "Time não encontrado"})
      }
      res.json({message: "Time deletado com sucesso!"})
    } catch(err) {
      res.status(500).json({error: "Erro ao deletar time."})
    }
  },
};

export default teamsController;
