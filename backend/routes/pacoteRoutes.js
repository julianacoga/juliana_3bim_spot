const express = require('express');
const multer = require('multer');
const router = express.Router();
const pacoteController = require('../controllers/pacoteController');

// Configura o Multer para armazenar em memória temporária para o Sharp processar
const upload = multer({ storage: multer.memoryStorage() });

// Rotas do CRUD de Pacotes
router.get('/listar', pacoteController.listarPacote);
router.get('/:id', pacoteController.obterPacote);
router.post('/', pacoteController.criarPacote);
router.put('/:id', pacoteController.atualizarPacote);
router.delete('/:id', pacoteController.deletarPacote);

// Rota para upload da imagem
router.post('/upload/:id', upload.single('imagem'), pacoteController.uploadImagem);

module.exports = router;