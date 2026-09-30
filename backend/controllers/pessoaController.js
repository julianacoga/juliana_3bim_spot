const { query } = require('../database');
const path = require('path');

exports.abrirCrudPessoa = (req, res) => {
  const usuario = req.cookies ? req.cookies.usuarioLogado : null;
  if (usuario) {
    res.sendFile(path.join(__dirname, '../../frontend/pessoa/pessoa.html'));
  } else {
    res.redirect('/login');
  }
};

exports.listarPessoas = async (req, res) => {
  try {
    const result = await query('SELECT * FROM pessoa ORDER BY cpf_pessoa');
    res.json({ sucesso: true, pessoas: result.rows });
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.criarPessoa = async (req, res) => {
  try {
    const { cpf_pessoa, nome_pessoa, data_nascimento_pessoa, email_pessoa, telefone_pessoa } = req.body;
    if (!nome_pessoa || !email_pessoa || !telefone_pessoa) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, email e telefone são obrigatórios'
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_pessoa)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Formato de email inválido'
      });
    }
    
    const result = await query(
      'INSERT INTO pessoa (cpf_pessoa, nome_pessoa, data_nascimento_pessoa, email_pessoa, telefone_pessoa) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cpf_pessoa, nome_pessoa, data_nascimento_pessoa, email_pessoa, telefone_pessoa]
    );
    res.status(201).json({ sucesso: true, pessoa: result.rows[0] });
  } catch (error) {
    console.error('Erro ao cadastrar pessoa:', error);
    
    if (error.code === '23505' && error.constraint === 'pessoa_unique') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email já está em uso'
      });
    }
    
    if (error.code === '23502') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados obrigatórios não fornecidos'
      });
    }
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.obterPessoa = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ sucesso: false, mensagem: 'CPF é obrigatório' });
    }
    
    const result = await query(
      'SELECT * FROM pessoa WHERE cpf_pessoa = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Pessoa não encontrada' });
    }
    res.json({ sucesso: true, pessoa: result.rows[0] });
  } catch (error) {
    console.error('Erro ao obter pessoa:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.atualizarPessoa = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome_pessoa, data_nascimento_pessoa, email_pessoa, telefone_pessoa } = req.body;
    
    if (email_pessoa) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_pessoa)) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Formato de email inválido'
        });
      }
    }
    
    const existingPersonResult = await query(
      'SELECT * FROM pessoa WHERE cpf_pessoa = $1',
      [id]
    );
    
    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Pessoa não encontrada' });
    }
    
    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      nome_pessoa: nome_pessoa !== undefined ? nome_pessoa : currentPerson.nome_pessoa,
      data_nascimento_pessoa: data_nascimento_pessoa !== undefined ? data_nascimento_pessoa : currentPerson.data_nascimento_pessoa,
      email_pessoa: email_pessoa !== undefined ? email_pessoa : currentPerson.email_pessoa,
      telefone_pessoa: telefone_pessoa !== undefined ? telefone_pessoa : currentPerson.telefone_pessoa
    };
    
    const updateResult = await query(
      'UPDATE pessoa SET nome_pessoa = $1, data_nascimento_pessoa = $2, email_pessoa = $3, telefone_pessoa = $4 WHERE cpf_pessoa = $5 RETURNING *',
      [updatedFields.nome_pessoa, updatedFields.data_nascimento_pessoa, updatedFields.email_pessoa, updatedFields.telefone_pessoa, id]
    );
    
    res.json({ sucesso: true, pessoa: updateResult.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    
    if (error.code === '23505' && error.constraint === 'pessoa_unique') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email já está em uso por outra pessoa'
      });
    }

    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.deletarPessoa = async (req, res) => {
  try {
    const id = req.params.id;
    const existingPersonResult = await query(
      'SELECT * FROM pessoa WHERE cpf_pessoa = $1',
      [id]
    );
    
    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Pessoa não encontrada' });
    }
    await query(
      'DELETE FROM pessoa WHERE cpf_pessoa = $1',
      [id]
    );
    
    res.json({ sucesso: true, mensagem: 'Pessoa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);
    
    if (error.code === '23503') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Não é possível deletar pessoa com dependências associadas'
      });
    }

    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.obterPessoaPorEmail = async (req, res) => {
  try {
    const { email_pessoa } = req.params;
    if (!email_pessoa) {
      return res.status(400).json({ sucesso: false, mensagem: 'Email é obrigatório' });
    }
    const result = await query(
      'SELECT * FROM pessoa WHERE email_pessoa = $1',
      [email_pessoa]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Pessoa não encontrada' });
    }

    res.json({ sucesso: true, pessoa: result.rows[0] });
  } catch (error) {
    console.error('Erro ao obter pessoa por email:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};