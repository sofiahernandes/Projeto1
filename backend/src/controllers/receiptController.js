import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../../prisma/lib/prisma.js";
import path from "path";
import fs from "fs";

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
      console.error("Erro no upload:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/comprovante/:IdContribuicaoFinanciera - (adiciona imagem pela contribuição financeira )
  addReceiptAtContribution: async (req, res) => {
    try {
      const { IdContribuicaoFinanceira } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      const contribuicaoExiste =
        await prisma.contribuicao_Financeira.findUnique({
          where: {
            IdContribuicaoFinanceira,
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

      const imagemUrl = req.file.path;

      const comprovante = await prisma.comprovante.create({
        data: { Imagem: imagemUrl },
      });

      const contribuicaoFinanAtualizada =
        await prisma.contribuicao_Financeira.update({
          where: { IdContribuicaoFinanceira },
          data: { IdComprovante: comprovante.IdComprovante },
          include: {
            comprovante: true,
            usuario: true,
          },
        });

      res.status(201).json({
        message: "Comprovante adicionado à contribuição com sucesso!",
        data: contribuicaoFinanAtualizada,
      });
    } catch (error) {
      console.error("Erro ao adicionar comprovante:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/comprovante/usuario/:raUsuario
  receiptByRA: async (req, res) => {
    try {
      const { RaUsuario } = req.params;

      const comprovantes = await prisma.contribuicao_Financeira.findMany({
        where: { RaUsuario: parseInt(RaUsuario) },
        include: {
          comprovante: true,
          usuario: true,
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
      console.error("Erro ao buscar comprovantes:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/comprovante/:IdComprovante
  receiptById: async (req, res) => {
    try {
      const { IdComprovante } = req.params;
      const contribuicao = await prisma.contribuicao_Financeira.findUnique({
        where: { IdContribuicaoFinanceira: parseInt(IdComprovante) },
        include: {
          comprovante: true,
          usuario: true,
        },
      });

      if (!contribuicao) {
        return res.status(404).json({
          error: "Contribuição não encontrada",
        });
      }

      res.json(contribuicao);
    } catch (error) {
      console.error("Erro ao buscar contribuição:", error);
      res.status(500).json({ error: error.message });
    }
  },

  //  GET http://localhost:3001/api/comprovante/todosComprovantes (listar todos- se for necessário)
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
      console.error("Erro ao listar comprovantes:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE http://localhost:3001/api/comprovante/:IdComprovante( deleta comprovante e tira da tabela de contribuição financeira)
  deleteReceiptById: async (req, res) => {
    try {
      const { IdComprovante } = req.params;

      const comprovante = await prisma.comprovante.findUnique({
        where: { IdComprovante: parseInt(IdComprovante) },
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
          if (err) console.warn("Erro ao remover arquivo local:", err);
        });
      } else {
        try {
          const urlParts = comprovante.Imagem.split("/");
          const uploadIndex = urlParts.indexOf("upload");

          if (uploadIndex !== -1) {
            const publicIdWithExt = urlParts.slice(uploadIndex + 2).join("/");
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // Remove extensão

            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudinaryError) {
          console.warn("Erro ao deletar do Cloudinary:", cloudinaryError);
        }
      }
      await prisma.comprovante.delete({
        where: { IdComprovante: parseInt(IdComprovante) },
      });

      res.status(200).json({
        message: "Comprovante excluído com sucesso!",
        id: parseInt(IdComprovante),
      });
    } catch (error) {
      console.error("Erro ao deletar comprovante:", error);

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