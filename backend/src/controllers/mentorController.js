import { pool } from "../db.js";

const mentorController = {
  //GET http://localhost:3001/api/mentors
  allMentors: async (_, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM mentor'
      )
      res.json(rows)
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar mentores.', details: err.message })
    }
  },

  //GET http://localhost:3001/api/mentors/:EmailMentor
  mentorById: async (req, res) => {
    const { IdMentor } = req.params;

    try {
      const [rows] = await pool.query(
        "SELECT * FROM mentor WHERE IdMentor=?",
        [IdMentor]
      )
      res.json(rows)
    } catch (err) {
      res.status(500).json({ error: "Mentor não encontrado." })
    }
  },

  //GET http://localhost:3001/api/mentors/:IdMentor
  mentorByEmail: async (req, res) => {
    const { EmailMentor } = req.params;

    try {
      const [rows] = await pool.query(
        "SELECT * FROM mentor WHERE EmailMentor=?",
        [EmailMentor]
      )
      res.json(rows)
    } catch (err) {
      res.status(500).json({ error: 'Erro ao encontrar mentor', details: err.message });
    }
  },

  //POST http://localhost:3001/api/createMentor
  createMentor: async (req, res) => {
    const { EmailMentor, IsAdmin, SenhaMentor } = req.body;

    if (!EmailMentor || !SenhaMentor || !IsAdmin) {
      alert("Preencha todos os campos");
      return req.status(400).json("Preencha todos os campos");
    }

    try {
      const [insert] = await pool.query(
        "INSERT INTO mentor (IdMentor, EmailMentor, SenhaMentor) VALUES(?,?,?)",
        [EmailMentor, SenhaMentor, IsAdmin]
      )

      const [rows] = await pool.query(
        "SELECT * FROM mentor WHERE IdMentor=?",
        [insert.insertId]
      )

      res.json(rows[0])
    } catch (err) {
      res.status(500).json({ error: "Erro ao cadastrar mentor", details: err.message })
    }
  },

  //DELETE http://localhost:3001/api/deleteMentor/:EmailMentor
  deleteMentor: (req, res) => {
    const { EmailMentor } = req.params;

    try {
      const [result] = pool.query(
        "DELETE FROM mentor WHERE EmailMentor=? CHECK IsAdmin=false",
        [EmailMentor]
      )
      if (result.affectedRows == 0) {
        res.status(404).json({ error: "Mentor não encontrado.", details: err.message })
      }
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar mentor.", details: err.message })
    }
  },
};

export default mentorController;
