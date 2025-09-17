import { Router } from "express";
import { pool } from "./db.js";

import contributionController from "./controllers/contributionController.js";
import adminController from "./controllers/adminController.js";
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

r.post("/api/createContribution", contributionController.createContribution);
r.get("/api/contributions", contributionController.allContributions);
r.delete("/api/deleteContribution/:IdContribuicao", contributionController.deleteContribution);

r.post("/api/createMentor", mentorController.createMentor);
r.get("/api/mentors", mentorController.allMentors);
r.get("/api/mentors/:IdMentor", mentorController.mentorById);
r.get("/api/mentors/:EmailMentor", mentorController.mentorByEmail);
r.delete("/api/deleteMentor/:EmailMentor", mentorController.deleteMentor);

r.post("/api/createTeam", teamController.createTeam);
r.get("/api/teams", teamController.allTeams);
r.get("/api/team/:IdTime", teamController.teamByID);
r.delete("/api/deleteTeam/:RA", teamController.deleteTeam);

r.post("/api/register/sign-up", userController.createUser);
r.get("/api/users", userController.allUsers);
r.get("/api/user/:RA", userController.userByRA);
r.delete("/api/deleteUser/:RA", userController.deleteUser);

export default r;
