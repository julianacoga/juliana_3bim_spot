const { query } = require('../database');
const path = require('path');

exports.abrirCrudCliente = (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/cliente/cliente.html'));
};

exports.listarClientes = async (req, res) => {
  try {
    const result = await query('SELECT cli.cpf_pessoa, p.nome_pessoa, cli.data_cadastro_cliente FROM cliente cli, pessoa p where cli.cpf_pessoa = p.cpf_pessoa ORDER BY cli.cpf_pessoa ');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.criarCliente = async (req, res) => {
  try {
    const { cpf_pessoa, data_cadastro_cliente } = req.body;
    const result = await query(
      'INSERT INTO cliente (cpf_pessoa, data_cadastro_cliente) VALUES ($1, $2) RETURNING *',
      [cpf_pessoa, data_cadastro_cliente]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    if (error.code === '23502') return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.obterCliente = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'ID deve ser um número válido' });

    const result = await query('SELECT * FROM cliente WHERE cpf_pessoa = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({
      sucesso: true,
      cliente: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.atualizarCliente = async (req, res) => {
  try {
    const id = req.params.id;
    const { data_cadastro_cliente } = req.body;
    const updatedFields = { data_cadastro_cliente };

    const updateResult = await query(
      'UPDATE cliente SET data_cadastro_cliente = $1 WHERE cpf_pessoa = $2 RETURNING *',
      [updatedFields.data_cadastro_cliente, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.deletarCliente = async (req, res) => {
  const id = req.params.id;

  try {
    const existingPersonResult = await query('SELECT * FROM cliente WHERE cpf_pessoa = $1', [id]);

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await query('DELETE FROM cliente WHERE cpf_pessoa = $1', [id]);

    res.status(204).send();
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({ error: 'Erro de integridade referencial - o cliente não pode ser excluído, pois está associado a outras entidades (ex: contratos).' });
    }

    res.status(500).json({ error: 'Erro interno do servidor ao tentar excluir o cliente.' });
  }
};