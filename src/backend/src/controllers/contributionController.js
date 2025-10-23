import { prisma } from "../../prisma/lib/prisma.js";

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

  
//GET http://localhost:3001/api/contributions/:RaUsuario
  getContributionsByRa: async (req, res) => {
  try {
    const { RaUsuario } = req.params;

    const contribuicao = await prisma.contribuicao.findMany({
      where: {
        RaUsuario: Number(RaUsuario)
      },
      orderBy:{
        DataContribuicao: 'desc'
      }
    }
  );
    res.json(contribuicao);
  } catch(err){
    if (contribuicao.lenght === 0){
      return res.status(404).json({err: "Não há contribuições cadastradas nesse Aluno Mentor"})
    } else {
      res
      .status(500)
      .json({ err: "Erro no servidor "})
    }
  }

},

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
  
  //DELETE http://localhost:3001/api/deleteContribution/:IdContribuicao
  deleteContribution: async (req, res) => {
    const { IdContribuicao } = req.params;
    try {
      const contribuicao = await prisma.contribuicao.delete({
        where: { IdContribuicao: String(IdContribuicao) },
      });
      res.json({ message: "Contribuição deletada com sucesso!", contribuicao });
    } catch (err) {
      res.status(404).json({ error: "Contribuição não encontrada" });
    }
  },

};

export default contributionController;
