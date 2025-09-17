import users, { findIndex, push, splice } from "../models/userModel";

const usersController = {
  allUsers: (_, res) => {
    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(users);
  },

  userByRA: (req, res) => {
    const { idUser } = req.params;

    const indexUser = findIndex((user) => user.idUser === idUser);
    if (indexUser === -1)
      return res.status(404).json({ message: "User not found" });

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(users[indexUser]);
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
    
    const user = {
      idUser: RA,
      nameUser,
      emailUser,
      passwordUser,
      idTeam,
    };

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    push(user);
    return res.status(201).json(user);
  },
  
  deleteUser: (req, res) => {
    const { idUser } = req.params;

    const raUser = findIndex((user) => user.idUser === idUser);
    if (raUser === -1)
      return res.status(404).json({ message: "User not found" });

    const result = splice(raUser, 1);

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(201).json(result);
  },
};

export default usersController;
