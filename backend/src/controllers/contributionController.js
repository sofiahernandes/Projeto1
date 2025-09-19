import { pool } from "../db.js";

const contributionController = {
  //GET http://localhost:3001/api/contributions
  allContributions: async (_, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM contribuicao");
      res.json(rows);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao listar contribuições.", details: err.message });
    }
  },

  //POST http://localhost:3001/api/createContribution
  createContribution: async (req, res) => {
    const { IdTime, TipoDoacao, Quantidade, Meta, Gastos, Fonte, Comprovante } =
      req.body;

    if (
      !IdTime ||
      !TipoDoacao ||
      !Quantidade ||
      !Meta ||
      !Gastos ||
      !Fonte ||
      !Comprovante
    ) {
      alert("Preencha todos os campos");
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    try {
      const [insert] = await pool.query(
        "INSERT INTO contribuicao (IdTime, TipoDoacao, Quantidade, Meta, Gastos, Fonte, Comprovante)  VALUES(?,?,?,?,?,?,?)",
        [IdTime, TipoDoacao, Quantidade, Meta, Gastos, Fonte, Comprovante]
      );
      const [rows] = await pool.query(
        "SELECT * FROM contribuicao WHERE IdContribuicao=?",
        [insert.insertId]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar contribuição", details: err.message });
    }
  },

  //DELETE http://localhost:3001/api/deleteContribution/:IdContribuicao
  deleteContribution: async (req, res) => {
    const { IdContribuicao } = req.params;

    try {
      const [result] = await pool.query(
        "DELETE FROM contribuicao WHERE IdContribuicao=?",
        [IdContribuicao]
      );
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Contribuição não encontrada", details: err.message });
      }
      res.json({ message: "Contribuição deletada com sucesso!" });
    } catch {
      res
        .status(500)
        .json({ error: "Erro ao deletar contribuição", details: err.message });
    }
  },
};

export default contributionController;
