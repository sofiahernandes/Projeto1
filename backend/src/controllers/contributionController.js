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
        ...financeContribs.map((contrib) => ({
          ...contrib,
          TipoDoacao: "Financeira",
        })),
        ...foodContribs.map((contrib) => ({
          ...contrib,
          TipoDoacao: "Alimenticia",
        })),
      ];

      // Sort by DataContribuicao (descending)
      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao)
      );

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
        ...financeContribs.map((contrib) => ({
          ...contrib,
          TipoDoacao: "Financeira",
        })),
        ...foodContribs.map((contrib) => ({
          ...contrib,
          TipoDoacao: "Alimenticia",
        })),
      ];

      if (allContribs.length === 0) {
        return res
          .status(404)
          .json({
            error: "Nenhuma contribuição encontrada para esse usuário.",
          });
      }

      // Sort by DataContribuicao (descending)
      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao)
      );

      res.json(allContribs);
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Erro ao buscar contribuições por RaUsuario.",
          details: err.message,
        });
    }
  },

  // GET CONTRIBUTIONS BY EDITION
  getContributionsByEdition: async (req, res) => {
    try {
      const { editionNumber } = req.params;
      const edition = Number(editionNumber);

      // determine the start and end dates for that edition
      const baseYear = 2025 + Math.floor((edition - 7) / 2);
      const isFirstSemester = edition % 2 === 1; // 7 -> true, 8 -> false, etc.

      const startDate = new Date(
        baseYear,
        isFirstSemester ? 0 : 7, // Jan or Aug
        1
      );
      const endDate = new Date(
        baseYear,
        isFirstSemester ? 6 : 11, // July or Dec
        31
      );

      // Fetch both types of contributions within this period
      const financeContribs = await prisma.Contribuicao_Financeira.findMany({
        where: {
          DataContribuicao: { gte: startDate, lte: endDate },
        },
        orderBy: { DataContribuicao: "desc" },
      });

      const foodContribs = await prisma.Contribuicao_Alimenticia.findMany({
        where: {
          DataContribuicao: { gte: startDate, lte: endDate },
        },
        orderBy: { DataContribuicao: "desc" },
        include: {
          Contribucao_Alimento: {
            include: { Alimento: true },
          },
        },
      });

      // merge both
      const allContribs = [
        ...financeContribs.map((c) => ({ ...c, TipoDoacao: "Financeira" })),
        ...foodContribs.map((c) => ({ ...c, TipoDoacao: "Alimenticia" })),
      ];

      if (allContribs.length === 0) {
        return res
          .status(404)
          .json({
            message: "Nenhuma contribuição encontrada para essa edição.",
          });
      }

      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao)
      );
      res.json(allContribs);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao buscar contribuições por edição.",
        details: err.message,
      });
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
    alimentos 
    } = req.body;

    // Validate required fields
    if (!RaUsuario || !TipoDoacao || !Fonte || !Comprovante) {
      return res
        .status(400)
        .json({ error: "Preencha todos os campos obrigatórios." });
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
          TipoDoacao,
          Meta,
          Gastos,
          Fonte,
          Comprovante,
          },
        });

        // Cria vínculos com cada alimento do array
        if (Array.isArray(alimentos) && alimentos.length > 0) {
          for (const item of alimentos) {
            const { IdAlimento, Quantidade, PesoUnidade } = item;

            if (!IdAlimento || !Quantidade || !PesoUnidade) continue;

            await prisma.Contribuicao_Alimento.create({
              data: {
                IdAlimento,
                IdContribuicaoAlimenticia:
                  contribuicao.IdContribuicaoAlimenticia,
              },
            });

            // Atualiza os dados da contribuição (quantidade/peso)
            await prisma.Contribuicao_Alimenticia.update({
              where: {
                IdContribuicaoAlimenticia:
                  contribuicao.IdContribuicaoAlimenticia,
              },
              data: { Quantidade, PesoUnidade },
            });
          }
        }
      } else {
        return res.status(400).json({ error: "Tipo de doação inválido." });
      }

      res.status(201).json(contribuicao);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Erro ao criar contribuição.", details: err.message });
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
