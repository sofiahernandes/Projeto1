import teams from "../models/teamsModel.js";

const teamsController = {
  allTeams: (_, res) => {
    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(teams);
  },

  teamByID: (req, res) => {
    const { idTeam } = req.params;

    const indexTeam = teams.findIndex((team) => team.idTeam === idTeam);
    if (indexTeam === -1)
      return res.status(404).json({ message: "Team not found" });

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(teams[indexTeam]);
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

    const team = {
      idTeam,
      teamEdition,
      teamPontuation,
      teamName,
    };

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    teams.push(team);
    return res.status(201).json(team);
  },

  deleteTeam: (req, res) => {
    const { idTeam } = req.params;

    const indexTeam = teams.findIndex((team) => team.idTeam === idTeam);
    if (indexTeam === -1)
      return res.status(404).json({ message: "Team not found" });

    const deleted = teams.splice(indexTeam, 1);

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(201).json(deleted);
  },
};

export default teamsController;
