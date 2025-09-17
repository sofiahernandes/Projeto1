import { pool } from "../db.js";

// GET /api/contributions
const contributionController = {
  allContributions: async (_, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM contribuicao'
      )
      res.json(rows)
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar contribuições.', details: err.message })
    }
  },


  // POST /api/createContribution
  createContribution: async (req, res) => {
    const {
      IdTime,
      TipoDoacao,
      Valor,
      Meta,
      NomeDoador,
      Fundos,
      Comprovante
    } = req.body;

    if (
      !IdTime ||
      !TipoDoacao ||
      !Valor ||
      !NomeDoador ||
      !Comprovante
    ) {
      alert("Preencha todos os campos");
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    try {
      const [insert] = await pool.query(
        'INSERT INTO contribuicao (Valor, TipoDoacao, Fundos, Meta, NomeDoador, IdTime)  VALUES(?,?,?,?,?,?,?)',
        [Valor, TipoDoacao, Fundos, Meta, NomeDoador, IdTime, Comprovante]
      )
      const [rows] = await pool.query(
        'SELECT * FROM contribuicao WHERE IdContribuicao=?',
        [insert.insertId]
      )
      res.status(201).json(rows[0])
    }
    catch (err) {
      res.status(500).json({ error: 'Erro ao criar contribuição', details: err.message });
    }
  },

  // Delete /api/deleteContribution/:IdContribuicao

  deleteContribution: async (req, res) => {
    const { IdContribuicao } = req.params;

    try {
      const [result] = await pool.query(
        'DELETE FROM contribuicao WHERE IdContribuicao=?',
        [IdContribuicao]
      )
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Contribuição não encontrada", details: err.message })
      }
      res.json({ message: "Contribuição deletada com sucesso!" })
    } catch {
      res.status(500).json({ error: "Erro ao deletar contribuição", details: err.message })
    }
  },
};

export default contributionController;
