import { prisma } from "../../prisma/lib/prisma.js";

const contributionController = {
  // ALL CONTRIBUTIONS (financial and food)
  allContributions: async (_, res) => {
    try {
      // Fetch financial contributions
      const financeContribs = await prisma.Contribuicao_Financeira.findMany({
        orderBy: { DataContribuicao: "desc" },
      });

      // Fetch food contributions
      const foodContribs = await prisma.Contribuicao_Alimenticia.findMany({
        orderBy: { DataContribuicao: "desc" },
        include: {
          Contribucao_Alimento: {
            include: {
              Alimento: true, // Fetch related food items
            },
          },
        },
      });

      // Combine both contributions into one array, tagging them by type
      const allContribs = [
        ...financeContribs.map((contrib) => ({ ...contrib, TipoDoacao: "Financeira" })),
        ...foodContribs.map((contrib) => ({
          ...contrib,
          TipoDoacao: "Alimenticia",
        })),
      ];

      // Sort by DataContribuicao (descending)
      allContribs.sort((a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao));

      res.json(allContribs);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao listar contribuições.", details: err.message });
    }
  },

  // GET CONTRIBUTIONS BY RaUsuario
  getContributionsByRa: async (req, res) => {
    try {
      const { RaUsuario } = req.params;

      // Fetch financial contributions for this user
      const financeContribs = await prisma.Contribuicao_Financeira.findMany({
        where: { RaUsuario: Number(RaUsuario) },
        orderBy: { DataContribuicao: "desc" },
      });

      // Fetch food contributions for this user
      const foodContribs = await prisma.Contribuicao_Alimenticia.findMany({
        where: { RaUsuario: Number(RaUsuario) },
        orderBy: { DataContribuicao: "desc" },
        include: {
          Contribucao_Alimento: {
            include: {
              Alimento: true, // Fetch related food items
            },
          },
        },
      });

      // Combine both contributions into one array
      const allContribs = [
        ...financeContribs.map((contrib) => ({ ...contrib, TipoDoacao: "Financeira" })),
        ...foodContribs.map((contrib) => ({
          ...contrib,
          TipoDoacao: "Alimenticia",
        })),
      ];

      if (allContribs.length === 0) {
        return res.status(404).json({ error: "Nenhuma contribuição encontrada para esse usuário." });
      }

      // Sort by DataContribuicao (descending)
      allContribs.sort((a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao));

      res.json(allContribs);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar contribuições por RaUsuario.", details: err.message });
    }
  },

  // CREATE CONTRIBUTION (handling both food and finance)
  createContribution: async (req, res) => {
    const {
      RaUsuario,
      TipoDoacao,
      Quantidade,
      Meta,
      Gastos,
      Fonte,
      Comprovante,
      PesoUnidade,  // Only for food donations
      IdAlimento,   // Only for food donations
    } = req.body;

    // Validate required fields
    if (!RaUsuario || !TipoDoacao || !Quantidade || !Fonte || !Comprovante) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    try {
      let contribuicao;

      // Handle financial donation
      if (TipoDoacao === "Financeira") {
        contribuicao = await prisma.Contribuicao_Financeira.create({
          data: {
            RaUsuario,
            TipoDoacao,
            Quantidade,
            Meta,
            Gastos,
            Fonte,
            Comprovante: comprovantePath,
          },
        });
      }
      // Handle food donation
      else if (TipoDoacao === "Alimenticia") {
        // Create food donation
        contribuicao = await prisma.Contribuicao_Alimenticia.create({
          data: {
            RaUsuario,
            Quantidade,
            PesoUnidade,
            TipoDoacao,
            Meta,
            Gastos,
            Fonte,
            Comprovante,
            IdAlimento,
          },
        });

        // Create a relationship between food and donation
        if (IdAlimento) {
          const contribuicao_alimento = await prisma.contribuicao_alimento.create({
            data: {
              IdAlimento,
              IdContribuicaoAlimenticia: contribuicao.IdContribuicaoAlimenticia,
            },
          });

          if (!contribuicao_alimento) {
            return res.status(404).json({ message: "Contribuição não registrada" });
          }
    
          res.json(contribuicao_alimento);
        }
      } else {
        return res.status(400).json({ error: "Tipo de doação inválido." });
      }

      res.status(201).json(contribuicao);
    } catch (err) {
      res.status(500).json({ error: "Erro ao criar contribuição.", details: err.message });
    }
  },

  // DELETE CONTRIBUTION (generic for both)
  deleteContribution: async (req, res) => {
    const { IdContribuicao } = req.params;

    try {
      const contribuicao = await prisma.Contribuicao_Financeira.delete({
        where: { IdContribuicao: Number(IdContribuicao) },
      });

      if (!contribuicao) {
        return res.status(404).json({ error: "Contribuição não encontrada." });
      }

      res.json({ message: "Contribuição deletada com sucesso!", contribuicao });
    } catch (err) {
      res.status(404).json({ error: "Contribuição não encontrada." });
    }
  },
};

export default contributionController;
