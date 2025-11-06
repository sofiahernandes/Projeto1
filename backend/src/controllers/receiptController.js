import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../../prisma/lib/prisma.js";
import path from "path";
import fs from "fs";

const isDev = process.env.NODE_ENV !== "production";

const receiptController = {
  // POST http://localhost:3001/api/comprovante
  uploadReceipt: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }
      const imagemUrl = req.file.path;
      const comprovante = await prisma.comprovante.create({
        data: { Imagem: imagemUrl },
      });
      res.status(201).json({
        message: "Imagem enviada com sucesso!",
        data: comprovante,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST http://localhost:3001/api/comprovante/:IdContribuicaoFinanciera - (adiciona imagem pela contribuição financeira )
  addReceiptAtContribution: async (req, res) => {
    try {
      const { IdContribuicaoFinanceira } = req.params;
      const contributionId = parseInt(IdContribuicaoFinanceira, 10);

      if (isNaN(contributionId)) {
        return res.status(400).json({ error: "ID de contribuição inválido." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      const contribuicaoExiste =
        await prisma.contribuicao_Financeira.findUnique({
          where: {
            IdContribuicaoFinanceira: contributionId,
          },
          include: {
            comprovante: Number(IdComprovante),
          },
        });

      if (!contribuicaoExiste) {
        if (!isDev && req.file.path) {
          const urlParts = req.file.path.split("/");
          const publicIdWithExt = urlParts
            .slice(urlParts.indexOf("upload") + 2)
            .join("/");
          const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
          await cloudinary.uploader.destroy(publicId);
        }
        return res.status(404).json({ error: "Contribuição não encontrada" });
      }
      if (!contribuicaoExiste.IdComprovante) {
        return res.status(400).json({
          error: "Esta contribuição não possui um comprovante vinculado",
        });
      }
      const imagemUrl = req.file.path;

      const comprovanteAtualizado = await prisma.comprovante.update({
        where: { IdComprovante: contribuicaoExiste.IdComprovante },
        data: { Imagem: imagemUrl },
      });

      const contribuicaoFinalizada =
        await prisma.contribuicao_Financeira.findUnique({
          where: { IdContribuicaoFinanceira: contributionId },
          include: {
            comprovante: true,
            usuario: {
              select: {
                RaUsuario: true,
                NomeUsuario: true,
                EmailUsuario: true,
              },
            },
          },
        });
      res.status(200).json({
        message: "Comprovante atualizado com sucesso!",
        data: { ...contribuicaoFinalizada, TipoDoacao: "Financeira" },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET http://localhost:3001/api/comprovante/usuario/:raUsuario
  receiptByRA: async (req, res) => {
    try {
      const { RaUsuario } = req.params;

      const comprovantes = await prisma.contribuicao_Financeira.findMany({
        where: { RaUsuario: parseInt(RaUsuario, 10) },
        include: {
          comprovante: true,
          usuario: {
            select: {
              RaUsuario: true,
              NomeUsuario: true,
              EmailUsuario: true,
            },
          },
        },
        orderBy: { DataContribuicao: "desc" },
      });

      if (comprovantes.length === 0) {
        return res.status(404).json({
          error: "Nenhum comprovante encontrado para este usuário",
        });
      }

      res.json(comprovantes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET http://localhost:3001/api/comprovante/:IdComprovante
  receiptById: async (req, res) => {
    try {
      const { IdComprovante } = req.params;
      const receiptId = parseInt(IdComprovante, 10);

      if (isNaN(receiptId)) {
        return res.status(400).json({ error: "ID de comprovante inválido." });
      }

      const comprovante = await prisma.comprovante.findUnique({
        where: { IdComprovante: receiptId },
        include: {
          contribuicao_financeira: {
            include: {
              usuario: {
                select: {
                  RaUsuario: true,
                  NomeUsuario: true,
                  EmailUsuario: true,
                },
              },
            },
          },
        },
      });

      if (!comprovante) {
        return res.status(404).json({
          error: "Comprovante não encontrado",
        });
      }

      res.json(comprovante);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllReceipts: async (req, res) => {
    try {
      const comprovantes = await prisma.comprovante.findMany({
        include: {
          contribuicao_financeira: {
            include: {
              usuario: {
                select: {
                  RaUsuario: true,
                  NomeUsuario: true,
                  EmailUsuario: true,
                },
              },
            },
          },
        },
        orderBy: { IdComprovante: "desc" },
      });

      res.json(comprovantes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE http://localhost:3001/api/comprovante/:IdComprovante( deleta comprovante e tira da tabela de contribuição financeira)
  deleteReceiptById: async (req, res) => {
    try {
      const { IdComprovante } = req.params;
      const receiptId = parseInt(IdComprovante, 10);

      if (isNaN(receiptId)) {
        return res.status(400).json({ error: "ID de comprovante inválido." });
      }

      const comprovante = await prisma.comprovante.findUnique({
        where: { IdComprovante: receiptId },
        include: {
          contribuicao_financeira: true,
        },
      });

      if (!comprovante) {
        return res.status(404).json({ error: "Comprovante não encontrado" });
      }

      if (comprovante.contribuicao_financeira) {
        await prisma.contribuicao_Financeira.update({
          where: {
            IdContribuicaoFinanceira:
              comprovante.contribuicao_financeira.IdContribuicaoFinanceira,
          },
          data: { IdComprovante: null },
        });
      }

      if (isDev) {
        const filepath = path.resolve(comprovante.Imagem);
        fs.unlink(filepath, (err) => {
          if (err) alert("Erro ao remover arquivo local:", err);
        });
      } else {
        try {
          const urlParts = comprovante.Imagem.split("/");
          const uploadIndex = urlParts.indexOf("upload");

          if (uploadIndex !== -1) {
            const publicIdWithExt = urlParts.slice(uploadIndex + 2).join("/");
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudinaryError) {
          console.warn("Erro ao deletar do Cloudinary:", cloudinaryError);
        }
      }

      await prisma.comprovante.delete({
        where: { IdComprovante: receiptId },
      });

      res.status(200).json({
        message: "Comprovante excluído com sucesso!",
        id: receiptId,
      });
    } catch (error) {
      if (error.code === "P2003") {
        return res.status(409).json({
          error:
            "Não é possível deletar: comprovante vinculado a uma contribuição",
        });
      }

      res.status(500).json({ error: error.message });
    }
  },
};

export default receiptController;
