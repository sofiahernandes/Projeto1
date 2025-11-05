import express, { Router } from "express";
import { pool } from "./db.js";

import contributionController from "./controllers/contributionController.js";
import teamController from "./controllers/teamController.js";
import mentorController from "./controllers/mentorController.js";
import userController from "./controllers/userController.js";
import authController from "./controllers/authController.js";
import receiptController from "./controllers/receiptController.js";
const r = Router();

r.get("/db/health", async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS db_ok");
    res.json({ ok: true, db: rows[0].db_ok });
  } catch {
    res.status(500).json({ ok: false, db: "down" });
  }
});

r.post("/createContribution", contributionController.createContribution);
r.get("/contributions", contributionController.allContributions);
r.get("/contributions/:RaUsuario", contributionController.getContributionsByRa);
r.get(
  "/contributions/edition/:editionNumber",
  contributionController.getContributionsByEdition
);
r.delete(
  "/deleteContribution/:IdContribuicao",
  contributionController.deleteContribution
);

r.post("/createMentor/:RaUsuario", mentorController.createMentor);
r.post("/loginMentor", mentorController.loginMentor);
r.get("/mentors", mentorController.allMentors);
r.post("/createAdmin", mentorController.createAdmin);
r.post("/loginAdmin", mentorController.loginAdmin);
r.get("/mentor/id/:IdMentor", mentorController.mentorById);
r.get("/mentor/email/:EmailMentor", mentorController.mentorByEmail);
r.delete("/deleteMentor/:EmailMentor", mentorController.deleteMentor);

r.post("/createTeam", teamController.createTeam);
r.get("/teams", teamController.allTeams);
r.get("/team/:IdTime", teamController.teamByID);
r.get("/:RaUsuario/userTeam", teamController.teamByUserRA);
r.delete("/deleteTeam/:IdTime", teamController.deleteTeam);

r.post("/register", authController.createUser);

r.get("/users", userController.allUsers);
r.get("/user/:RaUsuario", userController.userByRA);
r.post("/user/login", authController.loginUser);
r.post("/logOutUser", authController.logOutUser);
r.delete("/deleteUser/:RaUsuario", userController.deleteUser);

r.post("/comprovante", receiptController.uploadReceipt);
r.post("/comprovante/:IdContribuicaoFinanciera",receiptController.addReceiptAtContribution);
r.get("/comprovante/:RaUsuario", receiptController.receiptByRA);
r.get("/comprovante/:IdComprovante ", receiptController.receiptById);
r.get("/comprovante/todosComprovantes", receiptController.getAllReceipts);
r.delete("comprovante/:IdComprovante", receiptController.deleteReceiptById);
export default r;
