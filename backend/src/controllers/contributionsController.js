import { v4 } from "uuid";
import contributions, { findIndex, push } from "../models/contributionsModel";

const contributionsController = {
  allContributions: (_, res) => {
    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(contributions);
  },

  createContribution: async (req, _) => {
    const {
      idTeam,
      typeContribution,
      quantityContribution,
      pontuationContribution,
      receiptContribution,
    } = req.body;

    if (
      !idTeam ||
      !typeContribution ||
      !quantityContribution ||
      !pontuationContribution ||
      !receiptContribution
    ) {
      // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
      return req.status(400).json("Preencha todos os campos");
    }

    const contribution = {
      idContribution: v4(),
      idTeam,
      typeContribution,
      quantityContribution,
      pontuationContribution,
      receiptContribution,
    };

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    push(contribution);
    return res.status(201).json(contribution);
  },

  deleteContribution: (req, res) => {
    const { idContribution } = req.params;

    const indexContribution = findIndex(
      (contribution) => contribution.idContribution === idContribution
    );
    if (indexContribution === -1)
      return res.status(404).json({ message: "Contribution not found" });

    const deleted = splice(indexContribution, 1);

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(201).json(deleted);
  },
};

export default contributionsController;
