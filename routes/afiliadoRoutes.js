// routes/afiliadoRoutes.js
import express from 'express';
import Afiliado from '../models/Afiliado.js';

const router = express.Router();

// GET /api/afiliados - Listar todos os afiliados
router.get('/', async (req, res) => {
  try {
    const afiliados = await Afiliado.find().sort({ createdAt: -1 });
    res.json(afiliados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar afiliados' });
  }
});

// POST /api/afiliados - Cadastrar novo afiliado
router.post('/', async (req, res) => {
  try {
    const novoAfiliado = new Afiliado(req.body);
    const salvo = await novoAfiliado.save();
    res.status(201).json(salvo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao salvar afiliado', detalhe: error.message });
  }
});

// PUT /api/afiliados/:id - Atualizar afiliado
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Afiliado.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar afiliado' });
  }
});

// DELETE /api/afiliados/:id - Excluir afiliado
router.delete('/:id', async (req, res) => {
  try {
    await Afiliado.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Afiliado excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir afiliado' });
  }
});

export default router;
