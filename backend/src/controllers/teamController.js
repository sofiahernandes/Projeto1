import { pool } from "../db.js";

const teamsController = {
  allTeams: (_, res) => {
    // aqui
  },

  teamByID: (req, res) => {
    const { idTeam } = req.params;

    // aqui
  },

  createTeam: (req, res) => {
    const { idTeam, teamEdition, teamPontuation, teamName } = req.body;

    if (
      !idTeam ||
      !teamEdition ||
      !teamPontuation ||
      !teamName
    ) {
      return req.status(400).json("Preencha todos os campos");
    }

    // aqui
  },

  deleteTeam: (req, res) => {
    const { idTeam } = req.params;

    // aqui
  },
};

export default teamsController;
