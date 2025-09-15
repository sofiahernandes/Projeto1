import { v4 } from "uuid";
import mentors, { findIndex, push, splice } from "../models/mentorModel";

const mentorController = {
  allMentors: (_, res) => {
    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(mentors);
  },

  mentorByID: (req, res) => {
    const { idMentor } = req.params;

    const indexMentor = findIndex((mentor) => mentor.idMentor === idMentor);
    if (indexMentor === -1)
      return res.status(404).json({ message: "Mentor not found" });

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(mentors[indexMentor]);
  },

  mentorByEmail: (req, res) => {
    const { emailMentor } = req.params;

    const indexMentor = findIndex((mentor) => mentor.emailMentor === emailMentor);
    if (indexMentor === -1)
      return res.status(404).json({ message: "Mentor not found" });

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(200).json(mentors[indexMentor]);
  },

  createMentor: (req, res) => {
    const { emailMentor, passwordMentor } = req.body;

    if (!emailMentor || !passwordMentor) {
      return req.status(400).json("Preencha todos os campos");
    }

    const mentor = {
      idMentor: v4(),
      emailMentor,
      passwordMentor
    };

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    push(mentor);
    return res.status(201).json(mentor);
  },

  deleteMentor: (req, res) => {
    const { emailMentor } = req.params;

    const indexMentor = findIndex(
      (mentor) => mentor.emailMentor === emailMentor
    );
    if (indexMentor === -1)
      return res.status(404).json({ message: "Mentor not found" });

    const deleted = splice(indexMentor, 1);

    // Inserir aqui códigos de manipulação da Base de Dados SQL aprendidos em aula (Web Full-stack)
    return res.status(201).json(deleted);
  },
};

export default mentorController;
