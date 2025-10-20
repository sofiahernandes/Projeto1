//import db from '../db.js'
import bcrypt from "bcrypt";
import { createdToken, denyToken } from "../services/tokenServices";

const sanitizeUser = (u) => ({
  RaUsuario: u.rausuario,
  SenhaUsuario: u.senhausuario,
});

export const register = async (req, res) => {
  const { rausuario, senha } = req.body;
  if (!rausuario || !senha) {
    return res.status(400).json({ error: "Coloque o seu Ra e sua Senha" });
  }

  try {
    const [exists] = await prisma.query("");
  } catch {}
};
