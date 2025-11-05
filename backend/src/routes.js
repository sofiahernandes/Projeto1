import express, { Router } from "express";
import fs from "node:fs";
import { pool } from "./db.js";
import upload from "./uploadconfig.js";

import contributionController from "./controllers/contributionController.js";
import teamController from "./controllers/teamController.js";
import mentorController from "./controllers/mentorController.js";
import userController from "./controllers/userController.js";
import authController from "./controllers/authController.js";

const r = Router();

/* ------------------------- 🔹 TESTE DE CONEXÃO COM DB ------------------------- */
r.get("/db/health", async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS db_ok");
    res.json({ ok: true, db: rows[0].db_ok });
  } catch {
    res.status(500).json({ ok: false, db: "down" });
  }
});

/* ------------------------- 🔹 CONTRIBUIÇÕES ------------------------- */

r.post("/createContribution", contributionController.createContribution);
r.get("/contributions", contributionController.allContributions);
r.get("/contributions/:RaUsuario", contributionController.getContributionsByRa);
r.get("/contributions/edition/:editionNumber", contributionController.getContributionsByEdition);
r.delete("/deleteContribution/:IdContribuicao", contributionController.deleteContribution);

/* ------------------------- 🔹 MENTORES ------------------------- */
r.post("/createMentor/:RaUsuario", mentorController.createMentor);
r.post("/loginMentor", mentorController.loginMentor);
r.get("/mentors", mentorController.allMentors);
r.post("/createAdmin", mentorController.createAdmin);
r.post("/loginAdmin", mentorController.loginAdmin);
r.get("/mentor/id/:IdMentor", mentorController.mentorById);
r.get("/mentor/email/:EmailMentor", mentorController.mentorByEmail);
r.delete("/deleteMentor/:EmailMentor", mentorController.deleteMentor);

/* ------------------------- 🔹 TIMES ------------------------- */
r.post("/createTeam", teamController.createTeam);
r.get("/teams", teamController.allTeams);
r.get("/team/:IdTime", teamController.teamByID);
r.get("/:RaUsuario/userTeam", teamController.teamByUserRA);
r.delete("/deleteTeam/:IdTime", teamController.deleteTeam);

/* ------------------------- 🔹 USUÁRIOS / LOGIN ------------------------- */
r.post("/register", authController.createUser);
r.get("/users", userController.allUsers);
r.get("/user/:RaUsuario", userController.userByRA);
r.post("/user/login", authController.loginUser);
r.post("/logOutUser", authController.logOutUser);
r.delete("/deleteUser/:RaUsuario", userController.deleteUser);

/* ------------------------- 🔹 UPLOAD DE IMAGENS ------------------------- */
r.post("/images", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }
    const filepath = req.file.path;
    await pool.execute("INSERT INTO images (img) VALUES (?)", [filepath]);
    res.status(201).json({ message: "Imagem enviada!", img: filepath });
  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: error.message });
  }
});

r.get("/images", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM images ORDER BY ID DESC");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

r.put("/images/:ID", upload.single("image"), async (req, res) => {
  try {
    const { ID } = req.params;
    if (!req.file)
      return res.status(400).json({ error: "Nenhum arquivo enviado." });

    const newPath = req.file.path;
    const [old] = await pool.execute("SELECT * FROM images WHERE ID = ?", [ID]);
    if (old.length === 0)
      return res.status(404).json({ error: "Imagem não encontrada" });

    const oldPath = old[0].img;
    await pool.execute("UPDATE images SET img = ? WHERE ID = ?", [newPath, ID]);

    fs.unlink(oldPath, (err) => {
      if (err) console.warn("Erro ao remover antigo:", err);
    });

    res.json({ message: "Imagem atualizada com sucesso!", img: newPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

r.delete("/images/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const [rows] = await pool.execute("SELECT * FROM images WHERE ID = ?", [ID]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Imagem não encontrada" });

    const filepath = rows[0].img;
    await pool.execute("DELETE FROM images WHERE ID = ?", [ID]);

    fs.unlink(filepath, (err) => {
      if (err) console.warn("Erro ao remover arquivo:", err);
    });

    res.json({ message: "Imagem excluída com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default r;
