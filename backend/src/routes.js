import { Router } from "express";
import { pool } from "./db.js";

import contributionController from "./controllers/contributionController.js";
import teamController from "./controllers/teamController.js";
import mentorController from "./controllers/mentorController.js";
import userController from "./controllers/userController.js";

const r = Router();


r.get("/db/health", async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS db_ok");
    res.json({ ok: true, db: rows[0].db_ok });
  } catch {
    res.status(500).json({ok: false, db:'down'})
  }
});

r.post("/createContribution", contributionController.createContribution);
r.get("/contributions", contributionController.allContributions);
r.delete("/deleteContribution/:IdContribuicao", contributionController.deleteContribution);

r.post("/createMentor", mentorController.createMentor);
r.get("/mentors", mentorController.allMentors);
r.get("/mentor/id/:IdMentor", mentorController.mentorById);
r.get("/mentor/email/:EmailMentor", mentorController.mentorByEmail);
r.delete("/deleteMentor/:EmailMentor", mentorController.deleteMentor);

r.post("/createTeam", teamController.createTeam);
r.get("/teams", teamController.allTeams);
r.get("/team/:IdTime", teamController.teamByID);
r.get("/team/:RaUsuario", teamController.teamByUserRA);
r.delete("/deleteTeam/:IdTime", teamController.deleteTeam);

r.post("/register", userController.createUser);
r.get("/users", userController.allUsers);
r.get("/user/:RaUsuario", userController.userByRA);
r.post("/user/login", userController.loginUser);
r.delete("/deleteUser/:RaUsuario", userController.deleteUser);

export default r;
