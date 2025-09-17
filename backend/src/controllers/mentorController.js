import { pool } from "../db.js";

const mentorController = {
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

  mentorByID: async (req, res) => {
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

  createMentor: async (req, res) => {
    const { EmailMentor, SenhaMentor } = req.body;

    if (!EmailMentor || !SenhaMentor) {
      alert("Preencha todos os campos");
      return req.status(400).json("Preencha todos os campos");
    }

    try {
      const [insert] = await pool.query(
        "INSERT INTO mentor (IdMentor, EmailMentor, SenhaMentor) VALUES(?,?)",
        [EmailMentor, SenhaMentor]
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

  deleteMentor: (req, res) => {
    const { EmailMentor } = req.params;

    try {
      const [result] = pool.query(
        "DELETE FROM mentor WHERE EmailMentor=?",
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
