import { prisma } from "../../prisma/lib/prisma.js";

const contributionController = {
  allContributions: async (_, res) => {
    try {
      const financeContribs = await prisma.contribuicao_Financeira.findMany({
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: {
            select: {
              RaUsuario: true,
              NomeUsuario: true,
              EmailUsuario: true,
            },
          },
        },
      });

      const foodContribs = await prisma.contribuicao_Alimenticia.findMany({
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: {
            select: {
              RaUsuario: true,
              NomeUsuario: true,
              EmailUsuario: true,
            },
          },
          contribuicoes_alimento: {
            include: {
              alimento: true,
            },
          },
        },
      });

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

      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao)
      );

      res.json(allContribs);
    } catch (err) {
      console.error("Erro ao listar contribuições:", err);
      res.status(500).json({
        error: "Erro ao listar contribuições.",
        details: err.message,
      });
    }
  },

  getContributionsByRa: async (req, res) => {
    try {
      const { RaUsuario } = req.params;

      const financeContribs = await prisma.contribuicao_Financeira.findMany({
        where: { RaUsuario: Number(RaUsuario) },
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: true,
        },
      });

      const foodContribs = await prisma.contribuicao_Alimenticia.findMany({
        where: { RaUsuario: Number(RaUsuario) },
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: true,
          contribuicoes_alimento: {
            include: {
              alimento: true,
            },
          },
        },
      });

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
        return res.status(404).json({
          error: "Nenhuma contribuição encontrada para esse usuário.",
        });
      }

      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao)
      );

      res.json(allContribs);
    } catch (err) {
      console.error("Erro ao buscar contribuições por RA:", err);
      res.status(500).json({
        error: "Erro ao buscar contribuições por RaUsuario.",
        details: err.message,
      });
    }
  },

  getContributionsByEdition: async (req, res) => {
    try {
      const { editionNumber } = req.params;
      const edition = Number(editionNumber);

      const baseYear = 2025 + Math.floor((edition - 7) / 2);
      const isFirstSemester = edition % 2 === 1;

      const startDate = new Date(baseYear, isFirstSemester ? 0 : 7, 1);
      const endDate = new Date(
        baseYear,
        isFirstSemester ? 6 : 11,
        31,
        23,
        59,
        59
      );

      const financeContribs = await prisma.contribuicao_Financeira.findMany({
        where: {
          DataContribuicao: { gte: startDate, lte: endDate },
        },
        orderBy: { DataContribuicao: "desc" },
        include: { usuario: true },
      });

      const foodContribs = await prisma.contribuicao_Alimenticia.findMany({
        where: {
          DataContribuicao: { gte: startDate, lte: endDate },
        },
        orderBy: { DataContribuicao: "desc" },
        include: {
          usuario: true,
          contribuicoes_alimento: {
            include: { alimento: true },
          },
        },
      });

      const allContribs = [
        ...financeContribs.map((c) => ({ ...c, TipoDoacao: "Financeira" })),
        ...foodContribs.map((c) => ({ ...c, TipoDoacao: "Alimenticia" })),
      ];

      if (allContribs.length === 0) {
        return res.status(404).json({
          message: "Nenhuma contribuição encontrada para essa edição.",
        });
      }

      allContribs.sort(
        (a, b) => new Date(b.DataContribuicao) - new Date(a.DataContribuicao)
      );

      res.json(allContribs);
    } catch (err) {
      console.error("Erro ao buscar contribuições por edição:", err);
      res.status(500).json({
        error: "Erro ao buscar contribuições por edição.",
        details: err.message,
      });
    }
  },

  createContribution: async (req, res) => {
    const {
      RaUsuario,
      TipoDoacao,
      Quantidade,
      Meta,
      Gastos,
      Fonte,
      Valor,
      PesoUnidade,
      IdAlimento,
      alimentos,
      Imagem,
    } = req.body;

    if (!RaUsuario || !TipoDoacao) {
      return res.status(400).json({
        error: "RaUsuario e TipoDoacao são obrigatórios.",
      });
    }

    try {
      let contribuicao;
      
      if (TipoDoacao === "Financeira") {
        if (!Quantidade || !Fonte || Gastos === undefined) {
          return res.status(400).json({
            error:
              "Quantidade, Fonte e Gastos são obrigatórios para doação financeira.",
          });
        }
        const resultado = await prisma.$transaction(async (tx) => {
          const comprovante = await tx.comprovante.create({
            data: {
              Imagem: "",
            },
          });

          const contribuicao = await tx.contribuicao_Financeira.create({
            data: {
              RaUsuario: Number(RaUsuario),
              TipoDoacao,
              Quantidade: Number(Quantidade),
              Meta: Meta ? Number(Meta) : null,
              Gastos: Number(Gastos),
              Fonte,
              IdComprovante: comprovante.IdComprovante,
            },
            include: {
              usuario: {
                select: {
                  RaUsuario: true,
                  NomeUsuario: true,
                  EmailUsuario: true,
                },
              },
              comprovante: true,
            },
          });

          return contribuicao; 
        });
        return res.status(201).json({
          message: "Contribuição financeira criada com sucesso!",
          data: { ...resultado, TipoDoacao: "Financeira" },
        });
      } else if (TipoDoacao === "Alimenticia") {
        if (
          !Quantidade ||
          !PesoUnidade ||
          !alimentos ||
          alimentos.length === 0
        ) {
          return res.status(400).json({
            error:
              "Quantidade, PesoUnidade e alimentos são obrigatórios para doação alimentícia.",
          });
        }

        contribuicao = await prisma.contribuicao_Alimenticia.create({
          data: {
            RaUsuario: Number(RaUsuario),
            TipoDoacao,
            Quantidade: Number(Quantidade),
            PesoUnidade: Number(PesoUnidade),
            Gastos: Gastos ? Number(Gastos) : 0,
            Meta: Meta ? Number(Meta) : null,
            Fonte: Fonte || null,
            IdAlimento:
              alimentos.length === 1 ? Number(alimentos[0].IdAlimento) : null,
          },
          include: {
            usuario: true,
          },
        });

        const contribuicoesAlimento = await Promise.all(
          alimentos.map((alimento) =>
            prisma.contribuicao_Alimento.create({
              data: {
                IdAlimento: Number(alimento.IdAlimento),
                IdContribuicaoAlimenticia:
                  contribuicao.IdContribuicaoAlimenticia,
              },
            })
          )
        );

        const contribuicaoCompleta =
          await prisma.contribuicao_Alimenticia.findUnique({
            where: {
              IdContribuicaoAlimenticia: contribuicao.IdContribuicaoAlimenticia,
            },
            include: {
              usuario: true,
              contribuicoes_alimento: {
                include: {
                  alimento: true,
                },
              },
            },
          });

        return res.status(201).json({
          message: "Contribuição alimentícia criada com sucesso!",
          data: contribuicaoCompleta,
        });
      } else {
        return res.status(400).json({
          error: "Tipo de doação inválido. Use 'Financeira' ou 'Alimenticia'.",
        });
      }
    } catch (err) {
      console.error("Erro ao criar contribuição:", err);
      res.status(500).json({
        error: "Erro ao criar contribuição.",
        details: err.message,
      });
    }
  },

  deleteContribution: async (req, res) => {
    const { TipoDoacao, IdContribuicao } = req.params;

    try {
      let contribuicao;

      if (TipoDoacao === "Financeira") {
        contribuicao = await prisma.contribuicao_Financeira.delete({
          where: { IdContribuicaoFinanceira: Number(IdContribuicao) },
        });
      } else if (TipoDoacao === "Alimenticia") {
        await prisma.contribuicao_Alimento.deleteMany({
          where: { IdContribuicaoAlimenticia: Number(IdContribuicao) },
        });

        contribuicao = await prisma.contribuicao_Alimenticia.delete({
          where: { IdContribuicaoAlimenticia: Number(IdContribuicao) },
        });
      } else {
        return res.status(400).json({
          error: "Tipo de doação inválido.",
        });
      }

      res.json({
        message: "Contribuição deletada com sucesso!",
        data: contribuicao,
      });
    } catch (err) {
      console.error("Erro ao deletar contribuição:", err);

      if (err.code === "P2025") {
        return res.status(404).json({
          error: "Contribuição não encontrada.",
        });
      }

      res.status(500).json({
        error: "Erro ao deletar contribuição.",
        details: err.message,
      });
    }
  },
};

export default contributionController;
