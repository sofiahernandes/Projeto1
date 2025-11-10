import { prisma } from "../../prisma/lib/prisma.js";

const usersController = {
  //GET /api/users
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

  //GET /api/user/:RaUsuario
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
          },
          contribuicoes_alimenticias: {
            orderBy: { DataContribuicao: "desc" },
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

  //DELETE /api/deleteUser/:RaUsuario
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
