import { pool } from "../db.js";

const usersController = {
  allUsers: (_, res) => {
    // aqui
  },

  userByRA: (req, res) => {
    const { idUser } = req.params;

    // aqui
  },

  createUser: (req, res) => {
    const { RA, nameUser, emailUser, passwordUser, idTeam } = req.body;

    if (
      !RA ||
      !nameUser ||
      !emailUser ||
      !passwordUser ||
      !idTeam
    ) {
      return req.status(400).json("Preencha todos os campos");
    }

    // aqui
  },
  
  deleteUser: (req, res) => {
    const { idUser } = req.params;

    // aqui
  },
};

export default usersController;
