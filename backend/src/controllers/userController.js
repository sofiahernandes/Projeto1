import { pool } from "../db.js";

const usersController = {
  //GET http://localhost:3001/api/users
  allUsers: async (_, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM user");
      res.json(rows);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao listar Alunos Mentores",
        details: err.message,
      });
    }
  },

  //GET http://localhost:3001/api/user/:RaAlunoM
  userByRA: async (req, res) => {
    const { RaAlunoM } = req.params;
    try {
      const [rows] = await pool.query("SELECT * FROM user WHERE RaAlunoM = ?", [
        RaAlunoM,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Aluno mentor não encontrado" });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Erro no servidor", details: err.message });
    }
  },

  //GET http://localhost:3001/api/register
  createUser: async (req, res) => {
    const { RaAlunoM, NomeUsuario, EmailUsuario, SenhaAluno, Telefone, Turma } =
      req.body;

    if (
      !RaAlunoM ||
      !NomeUsuario ||
      !EmailUsuario ||
      !SenhaAluno ||
      !Telefone ||
      !Turma
    ) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    try {
      const [insert] = await pool.query(
        "INSERT INTO user (RaAlunoM, NomeAlunoM, Email, SenhaAluno, Telefone, Turma) VALUES (?, ?, ?, ?, ?, ?)",
        [RaAlunoM, NomeUsuario, EmailUsuario, SenhaAluno, Telefone, Turma]
      );

      const [rows] = await pool.query(
        "SELECT * FROM user WHERE IdUsuario = ?",
        [insert.insertId]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(409).json({
        error: "Aluno Mentor já existente",
        details: err.message,
      });
    }
  },

  //POST http://localhost:3001/api/user/login
  loginUser: async (req, res) => {
    const { RaAlunoM, senhaAlunoMentor } = req.body;

    if (!RaAlunoM || !senhaAlunoMentor) {
      return res.status(400).json({ error: "RA e senha são obrigatórios" });
    }

    try {
      const [rows] = await pool.query(
        "SELECT * FROM user WHERE RaAlunoM = ? AND SenhaAluno = ?",
        [RaAlunoM, senhaAlunoMentor]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Erro no login", details: err.message });
    }
  },

  //DELETE http://localhost:3001/api/deleteUser/:RaAlunoM
  deleteUser: async (req, res) => {
    const { RaAlunoM } = req.params;

    try {
      const [result] = await pool.query("DELETE FROM user WHERE RaAlunoM = ?", [
        RaAlunoM,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Aluno Mentor não encontrado" });
      }
      res.json({ message: "Aluno Mentor deletado com sucesso!" });
    } catch (err) {
      res.status(500).json({
        error: "Erro ao deletar aluno mentor",
        details: err.message,
      });
    }
  },
};

export default usersController;
