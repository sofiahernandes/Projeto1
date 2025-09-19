import { pool } from "../db.js";

const usersController = {
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

  userByRA: async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const [rows] = await pool.query("SELECT * FROM user WHERE RaAlunoM = ?", [
        idUsuario,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Aluno mentor não encontrado" });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Erro no servidor", details: err.message });
    }
  },

  createUser: async (req, res) => {
    const { RA, NomeUsuario, EmailUsuario, SenhaAluno, Telefone, Turma } =
      req.body;

    if (
      !RA ||
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
        [RA, NomeUsuario, EmailUsuario, SenhaAluno, Telefone, Turma]
      );

      const [rows] = await pool.query(
        "SELECT * FROM user WHERE idUsuario = ?",
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

  loginUser: async (req, res) => {
    const { RA, senhaAlunoMentor } = req.body;

    if (!RA || !senhaAlunoMentor) {
      return res.status(400).json({ error: "RA e senha são obrigatórios" });
    }

    try {
      const [rows] = await pool.query(
        "SELECT * FROM user WHERE RaAlunoM = ? AND SenhaAluno = ?",
        [RA, senhaAlunoMentor]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Erro no login", details: err.message });
    }
  },

  deleteUser: async (req, res) => {
    const { idUsuario } = req.params;

    try {
      const [result] = await pool.query("DELETE FROM user WHERE RaAlunoM = ?", [
        idUsuario,
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
