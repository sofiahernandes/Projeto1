import editions, { findIndex, push, splice } from "../models/editionsModel";

const editionsController = {
  allEditions: (_, res) => {
    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(editions);
  },

  editionByNumber: (req, res) => {
    const { idEdition } = req.params;

    const indexEdition = findIndex(
      (edition) => edition.idEdition === parseInt(idEdition)
    );
    if (indexEdition === -1)
      return res.status(404).json({ message: "Edition not found" });

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(editions[indexEdition]);
  },

  createEdition: (req, res) => {
    const { idEdition, editionStartDate, editionEndDate } = req.body;

    if (
      !idEdition ||
      !editionStartDate ||
      !editionEndDate
    ) {
      return req.status(400).json("Preencha todos os campos");
    }

    const edition = {
      idEdition,
      editionStartDate,
      editionEndDate,
    };

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    push(edition);
    return res.status(201).json(edition);
  },

  deleteEdition: (req, res) => {
    const { idEdition } = req.params;

    const indexEdition = findIndex(
      (edition) => edition.idEdition === idEdition
    );
    if (indexEdition === -1)
      return res.status(404).json({ message: "Edition not found" });

    const deleted = splice(indexEdition, 1);

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(201).json(deleted);
  },
};

export default editionsController;
