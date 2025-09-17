import { pool } from "../db.js";

const usersController = {
  allUsers: async(_, res) => {
    try{
      const[rows] = await pool.query(
        'SELECT * FROM user'
      )
      res.json(rows)
    }catch(err){
      res.status(500).json({ error: 'Erro ao listar Alunos Mentores', details: err.message })
    }
  },

  userByRA: async(req, res) => {
    const { idUsuario } = req.params;
    try{
      const[rows] = await pool.query(
        'SELECT RaAlunoM FROM user',
        [idUsuario]
      ) 
      res.json(rows)
    }catch(err){
      res.status(500).json({ error: "Aluno mentor não encontrado"})
    }
    
  },

  createUser: async(req, res) => {
    const { RA, nomeUsuario, emailUsuario, SenhaAluno , Telefone, Turma } = req.body;

    if (
      !RA ||
      !nomeUsuario ||
      !emailUsuario ||
      !SenhaAluno ||
      !Telefone ||
      !Turma
    ) {
      alert("Preencha todos os campos");
      return req.status(400).json("Preencha todos os campos");
    }
    try{
      const[insert] = await pool.query(
        'INSERT INTO user (RaAlunoM, NomeAlunoM, Email, SenhaAluno , Telefone, Turma ) values(?,?,?,?,?,?)',
      [RA, nomeUsuario, emailUsuario, SenhaAluno , Telefone, Turma]
      )
      const[rows] = await pool.query(
        'SELECT * FROM user',
        [insert.insertId]
      )
      res.status(201).json(rows[0])
    }catch(err){
      res.status(409).json({error: 'Aluno Mentor já existente', details: err.message})
    }
    
  },
  
  deleteUser: async(req, res) => {
    const { idUsuario } = req.params;

    try{
      const[result] = await pool.query(
        'DELETE FROM user WHERE RaAlunoM',
        [idUsuario]
      )
      if(result.affectedRows === 0){
        return res.status(404).json({error:'Aluno Mentor não encontrado', details: err.message})
      }
      res.json({ message:'Aluno Mentor deletado com sucesso!'})
    }catch{
      res.status(500).json({ error: 'Erro ao deletar aluno mentor', details: err.message})
    }
  },
};

export default usersController;
