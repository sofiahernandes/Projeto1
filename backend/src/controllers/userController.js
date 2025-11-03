import bcrypt from "bcrypt";
import { prisma } from "../../prisma/lib/prisma.js";
import { createToken, denyToken } from "../services/tokenServices.js";

const usersController = {
  //GET http://localhost:3001/api/users
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

  //GET http://localhost:3001/api/user/:RaUsuario
  userByRA: async (req, res) => {
    const { RaUsuario } = req.params;
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { RaUsuario: Number(RaUsuario) },
      });
      res.json(usuario);
    } catch (err) {
      if (err.code == P2025) {
        return res.status(404).json({ error: "Aluno mentor não encontrado" });
      } else {
        res
          .status(500)
          .json({ error: "Erro no servidor", details: err.message });
      }
    }
  },

  //DELETE http://localhost:3001/api/deleteUser/:RaUsuario
  deleteUser: async (req, res) => {
    const { RaUsuario } = req.params;

    try {
      const usuario = await prisma.usuario.delete({
        where: { RaUsuario: RaUsuario },
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
