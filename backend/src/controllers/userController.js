import bcrypt from "bcrypt";
import { prisma } from "../../prisma/lib/prisma.js"

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
  // try {
  //   const [rows] = await pool.query("SELECT * FROM usuario");
  //   res.json(rows);
  // } catch (err) {
  //   res.status(500).json({
  //     error: "Erro ao listar Alunos Mentores",
  //     details: err.message,
  //   });
  // }

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
  // try {
  //   const [rows] = await pool.query("SELECT * FROM usuario WHERE RaUsuario = ?", [
  //     RaUsuario,
  //   ]);
  //   if (rows.length === 0) {
  //     return res.status(404).json({ error: "Aluno mentor não encontrado" });
  //   }
  //   res.json(rows[0]);
  // } catch (err) {
  //   res.status(500).json({ error: "Erro no servidor", details: err.message });
  // }

  //POST http://localhost:3001/api/register
  createUser: async (req, res) => {
    const {
      RaUsuario,
      NomeUsuario,
      EmailUsuario,
      SenhaUsuario,
      TelefoneUsuario,
      Turma,
    } = req.body;

    const hashedPassword = await bcrypt.hash(SenhaUsuario, 16);

    if (
      !RaUsuario ||
      !NomeUsuario ||
      !EmailUsuario ||
      !SenhaUsuario ||
      !TelefoneUsuario ||
      !Turma
    ) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    try {
      const usuario = await prisma.usuario.create({
        data: {
          RaUsuario,
          NomeUsuario,
          EmailUsuario,
          SenhaUsuario: hashedPassword,
          TelefoneUsuario,
          Turma,
        },
      });
      res.json(usuario);
    } catch (err) {
      if(err.code == P2002){ res.status(409).json({
        error: "Aluno Mentor já existente",
        details: err.message,
      })
    }
      else{
      res.status(500).json({
        error: "Erro ao cadastrar Aluno Mentor..",
        details: err.message
      })
    } 
  }
  },

  // try {
  //   const [insert] = await pool.query(
  //     "INSERT INTO usuario (RaUsuario, NomeUsuario, EmailUsuario, SenhaUsuario, TelefoneUsuario, Turma) VALUES (?, ?, ?, ?, ?, ?)",
  //     [RaUsuario, NomeUsuario, EmailUsuario, SenhaUsuario, TelefoneUsuario, Turma]
  //   );

  //   const [rows] = await pool.query(
  //     "SELECT * FROM usuario WHERE RaUsuario = ?",
  //     [RaUsuario]
  //   );
  //   res.status(201).json(rows[0]);
  // } catch (err) {
  //   res.status(409).json({
  //     error: "Aluno Mentor já existente",
  //     details: err.message,
  //   });
  // }

  //POST http://localhost:3001/api/user/login
  loginUser: async (req, res) => {
    const { RaUsuario, SenhaUsuario } = req.body;

    if (!RaUsuario || !SenhaUsuario) {
      return res.status(400).json({ error: "RA e senha são obrigatórios" });
    }
    try {
      const usuario = await prisma.usuario.findFirst({
        where: {
          RaUsuario: RaUsuario,
          SenhaUsuario: SenhaUsuario,
        },
      });
       const senhaValida = await bcrypt.compare(SenhaUsuario, usuario.SenhaUsuario);

    if (!senhaValida) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    res.json({ message: "Login realizado com sucesso", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no login" });
  }
  }, 
  // try {
  //   const [rows] = await pool.query(
  //     "SELECT * FROM usuario WHERE RaUsuario = ? AND SenhaUsuario = ?",
  //     [RaUsuario, SenhaUsuario]
  //   );

  //   if (rows.length === 0) {
  //     return res.status(401).json({ error: "Credenciais inválidas" });
  //   }

  //   res.json(rows[0]);
  // } catch (err) {
  //   res.status(500).json({ error: "Erro no login", details: err.message });
  // }

  //DELETE http://localhost:3001/api/deleteUser/:RaUsuario
  deleteUser: async (req, res) => {
    const { RaUsuario } = req.params;

    try {
      const usuario = await prisma.usuario.delete({
        where: { RaUsuario: RaUsuario },
      });
      res.json({ message: "Aluno Mentor deletado com sucesso!", usuario });
    } catch (err) {
      if (err.code == P2025) {
        return res.status(404).json({ error: "Aluno Mentor não encontrado" });
      }
      res.status(500).json({
        error: "Erro ao deletar aluno mentor",
        details: err.message,
      });
    }
  },
};

// try {
//   const [result] = await pool.query("DELETE FROM usuario WHERE RaUsuario = ?", [
//     RaUsuario,
//   ]);
//   if (result.affectedRows === 0) {
//     return res.status(404).json({ error: "Aluno Mentor não encontrado" });
//   }
//   res.json({ message: "Aluno Mentor deletado com sucesso!" });
// } catch (err) {
//   res.status(500).json({
//     error: "Erro ao deletar aluno mentor",
//     details: err.message,
//   });
// }
export default usersController;
