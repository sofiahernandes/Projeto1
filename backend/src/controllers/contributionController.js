import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const contributionController = {
  //GET http://localhost:3001/api/contributions
  allContributions: async (_, res) => {
    try {
      const contribuicao = await prisma.contribuicao.findMany();
      res.json(contribuicao);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao listar contribuições.", details: err.message });
    }
  },

  // allContributions: async (_, res) => {
  //   try {
  //     const [rows] = await pool.query("SELECT * FROM contribuicao");
  //     res.json(rows);
  //   } catch (err) {
  //     res
  //       .status(500)
  //       .json({ error: "Erro ao listar contribuições.", details: err.message });
  //   }
  // },

  //POST http://localhost:3001/api/createContribution
  createContribution: async (req, res) => {
    const {
      RaUsuario,
      TipoDoacao,
      Quantidade,
      Meta,
      Gastos,
      Fonte,
      Comprovante,
    } = req.body;

    if (
      !RaUsuario ||
      !TipoDoacao ||
      !Quantidade ||
      !Meta ||
      !Gastos ||
      !Fonte ||
      !Comprovante
    ) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    try {
      const contribuicao = await prisma.contribuicao.create({
        data: {
          RaUsuario,
          TipoDoacao,
          Quantidade,
          Meta,
          Gastos,
          Fonte,
          Comprovante,
        },
      });
      res.status(201).json(contribuicao);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar contribuição", details: err.message });
    }
  },
  //   try {
  //     const [insert] = await pool.query(
  //       "INSERT INTO contribuicao (RaUsuario, TipoDoacao, Quantidade, Meta, Gastos, Fonte, Comprovante)  VALUES(?,?,?,?,?,?,?)",
  //       [RaUsuario, TipoDoacao, Quantidade, Meta, Gastos, Fonte, Comprovante]
  //     );
  //     const [rows] = await pool.query(
  //       "SELECT * FROM contribuicao WHERE IdContribuicao=?",
  //       [insert.insertId]
  //     );
  //     res.status(201).json(rows[0]);
  //   } catch (err) {
  //     res
  //       .status(500)
  //       .json({ error: "Erro ao criar contribuição", details: err.message });
  //   }
  // },

  //DELETE http://localhost:3001/api/deleteContribution/:IdContribuicao
  deleteContribution: async (req, res) => {
    const { IdContribuicao } = req.params;
    try {
      const contribuicao = await prisma.contribuicao.delete({
        where: { IdContribuicao: parseInt(IdContribuicao) },
      });
      res.json({ message: "Contribuição deletada com sucesso!", contribuicao });
    } catch (err) {
      res.status(404).json({ error: "Contribuição não encontrada" });
    }
  },

  //   try {
  //     const [result] = await pool.query(
  //       "DELETE FROM contribuicao WHERE IdContribuicao=?",
  //       [IdContribuicao]
  //     );
  //     if (result.affectedRows === 0) {
  //       return res
  //         .status(404)
  //         .json({ error: "Contribuição não encontrada", details: err.message });
  //     }
  //     res.json({ message: "Contribuição deletada com sucesso!" });
  //   } catch {
  //     res
  //       .status(500)
  //       .json({ error: "Erro ao deletar contribuição", details: err.message });
  //   }
  // },
};

export default contributionController;
