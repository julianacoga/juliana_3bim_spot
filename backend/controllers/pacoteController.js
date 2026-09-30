const { query } = require('../database');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Listar todos os pacotes
exports.listarPacotes = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.pacote ORDER BY id_pacote');
        res.json({ sucesso: true, pacotes: result.rows });
    } catch (error) {
        console.error('Erro ao listar pacotes:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar pacotes.' });
    }
};

// Obter pacote por ID
exports.obterPacote = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM public.pacote WHERE id_pacote = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'pacote não encontrado.' });
        }

        res.json({ sucesso: true, pacote: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter pacote:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar pacote
exports.criarPacote = async (req, res) => {
    try {
        const { destino, foto, descricao, id_categoria } = req.body;

        if (!destino) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome do pacote é obrigatório.' });
        }

        const sql = `
            INSERT INTO public.pacote (destino, foto, descricao, id_categoria, preco, estoque)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            destino,
            foto || null,
            descricao,
            id_categoria,
            preco,
            estoque
        ];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'pacote inserido com sucesso!', pacote: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar pacote:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID de categoria informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir pacote no banco de dados.' });
    }
};

// Atualizar pacote
exports.atualizarPacote = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { destino, foto, descricao, id_categoria, preco, estoque } = req.body;

        const sql = `
            UPDATE public.pacote 
            SET destino = $1, 
                foto = $2, 
                descricao = $3, 
                id_categoria = $4,
                preco = $5,
                estoque = $6
            WHERE id_pacote = $7
            RETURNING *
        `;

        const values = [
            destino,
            foto || null,
            descricao,
            id_categoria,
            preco,
            estoque,
            id
        ];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'pacote não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'pacote alterado com sucesso!', pacote: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar pacote:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O ID de categoria informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar pacote.' });
    }
};

// Upload e salvamento de imagem com Sharp
exports.uploadImagem = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nenhum arquivo enviado.' });
        }

        const pastaImagens = path.join(__dirname, '../../imagens');
        if (!fs.existsSync(pastaImagens)) {
            fs.mkdirSync(pastaImagens, { recursive: true });
        }

        const caminhoDestino = path.join(pastaImagens, `${id}.png`);

        // Processa e converte para PNG no tamanho ideal
        await sharp(req.file.buffer)
            .resize(300, 300, { fit: 'cover' })
            .toFormat('png')
            .toFile(caminhoDestino);

        res.json({ sucesso: true, mensagem: 'Imagem salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar imagem.' });
    }
};

// Deletar pacote
exports.deletarPacote = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('DELETE FROM public.pacote WHERE id_pacote = $1', [id]);

        const imgPath = path.join(__dirname, '../../imagens', `${id}.png`);
        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
        }

        res.json({ sucesso: true, mensagem: 'pacote excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar pacote:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir pacote.' });
    }
};