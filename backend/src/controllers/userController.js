import bcrypt from "bcrypt";

import { prisma } from "../../prisma/lib/prisma.js";
import { createToken, denyToken } from "../services/tokenServices.js";

const usersController = {
  allUsers: async (_, res) => {
    try {
      const usuario = await prisma.usuario.findMany();
      res.json(usuario);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao listar Alunos Mentores",
        details: err.message,
      });
    }
  },

  userByRA: async (req, res) => {
    const { RaUsuario } = req.params;

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { RaUsuario: parseInt(RaUsuario) },
        include: {
          time_usuarios: {
            include: {
              time: {
                select: {
                  IdTime: true,
                  NomeTime: true,
                  IdMentor: true,
                  mentor: {
                    select: {
                      IdMentor: true,
                      EmailMentor: true,
                    },
                  },
                },
              },
            },
          },
          contribuicoes_financeiras: {
            orderBy: { DataContribuicao: "desc" },
            take: 5,
          },
          contribuicoes_alimenticias: {
            orderBy: { DataContribuicao: "desc" },
            take: 5,
          },
        },
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erro no servidor",
        details: err.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    const { RaUsuario } = req.params;

    try {
      const usuario = await prisma.usuario.delete({
        where: { RaUsuario: Number(RaUsuario) },
      });
      res.json({ message: "Aluno Mentor deletado com sucesso!", usuario });
    } catch (err) {
      console.error("Erro ao deletar aluno mentor:", err);
      return res.status(500).json({
        error: "Erro ao deletar aluno mentor",
        details: err.message || "Erro desconhecido",
      });
    }
  },
};

export default usersController;
