import { v4 } from "uuid";
import contributions /*{ findIndex, push, splice } */ from "../models/contributionsModel.js";
import {pool} from "../db.js"

//GET http://localhost:3300/api/contributions
const contributionsController = {
  allContributions: async (_, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM contribuicao'
      )
      res.json(rows)
    } catch(err) {
      res.status(500).json({error: 'Erro ao listar contribuições.'})
    }
  },


//POST http://localhost:3300/api/createContribution
  createContribution: async (req, res) => {
    const {
      IdTime,
      TipoDoacao,
      Valor,
     // pontuationContribution,
      Meta,
      NomeDoador,
      Fundos,
     // receiptContribution
    } = req.body;

    if (
      !IdTime ||
      !TipoDoacao ||
      !Valor ||
      //!pontuationContribution ||
      !NomeDoador
    ) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const contribution = {
     // IdContribuicao: v4(),
      IdTime,
      TipoDoacao,
      Valor,
      //pontuationContribution,
      //receiptContribution,
      NomeDoador,
      Meta,
      Fundos
    };

    try{
      const[insert] = await pool.query(
        'INSERT INTO contribuicao (Valor, TipoDoacao, Fundos, Meta, NomeDoador, IdTime)  VALUES(?,?,?,?,?,?)',
      [Valor, TipoDoacao, Fundos, Meta, NomeDoador, IdTime]
      )
      const [rows] = await pool.query(
        'SELECT * FROM contribuicao WHERE IdContribuicao=?',
        [insert.insertId]
      )
      res.status(201).json(rows[0])     
    } 
    catch (err) {
      res.status(500).json({ error: 'ERRO ao criar contribuição', details: err.message });
      }
  },

  //Delete http://localhost:3300/api/deleteContribution/:IdContribuicao

  deleteContribution: async (req, res) => {
    const { IdContribuicao } = req.params;

    try{
      const [result] = await pool.query(
        'DELETE FROM contribuicao WHERE IdContribuicao=?',
        [IdContribuicao]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({error: "Contribuição não encontrada"}) 
        }
    res.json({message: "Contribuiçãoo deletada com sucesso!"})
    } catch {
      res.status(500).json({error: "Erro ao deletar contribuição"})
    }
  },
};

export default contributionsController;
