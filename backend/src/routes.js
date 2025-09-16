import { Router } from "express";
import { pool } from "./db.js";

import contributionsController from "./controllers/contributionsController";
import editionsController from "./controllers/editionsController";
import teamsController from "./controllers/teamsController";
import mentorController from "./controllers/mentorController";
import usersController from "./controllers/usersController";

const r = Router();

r.get("/db/health", async (_, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS db_ok");
    res.json({ ok: true, db: rows[0].db_ok });
  } catch {
    res.status(500).json({ok: false, db:'down'})
  }
});

r.post("/createContribution", contributionsController.createContribution);
r.get("/contributions", contributionsController.allContributions);
r.delete("/deleteContribution/:idContribution", contributionsController.deleteContribution);

r.post("/createEdition", editionsController.createEdition);
r.get("/editions", editionsController.allEditions);
r.get("/editions/:idEdition", editionsController.editionByNumber);
r.delete("/deleteEdition/:idEdition", editionsController.deleteEdition);

r.post("/createMentor", mentorController.createMentor);
r.get("/mentors", mentorController.allMentors);
r.get("/mentors/:idMentor", mentorController.mentorByEmail);
r.get("/mentors/:emailMentor", mentorController.mentorByEmail);
r.delete("/deleteMentor/:emailMentor", mentorController.deleteMentor);

r.post("/createTeam", teamsController.createTeam);
r.get("/teams", teamsController.allTeams);
r.get("/team/:idTeam", teamsController.teamByID);
r.delete("/deleteTeam/:RA", teamsController.deleteTeam);

r.post("/register/sign-up", usersController.createUser);
r.get("/users", usersController.allUsers);
r.get("/user/:RA", usersController.userByRA);
r.delete("/deleteUser/:RA", usersController.deleteUser);

export default r;
