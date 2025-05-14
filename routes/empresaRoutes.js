// routes/empresaRoutes.js
import express from 'express';
import Empresa from '../models/Empresa.js';

const router = express.Router();

// GET /api/empresas - Listar empresas
router.get('/', async (req, res) => {
  try {
    const empresas = await Empresa.find().sort({ _id: -1 });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar empresas' });
  }
});

// POST /api/empresas - Criar nova empresa
router.post('/', async (req, res) => {
  try {
    const novaEmpresa = new Empresa(req.body);
    const salva = await novaEmpresa.save();
    res.status(201).json(salva);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao salvar empresa', detalhe: error.message });
  }
});

// PUT /api/empresas/:id - Atualizar empresa
router.put('/:id', async (req, res) => {
  try {
    const atualizada = await Empresa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(atualizada);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar empresa' });
  }
});

// DELETE /api/empresas/:id - Excluir empresa
router.delete('/:id', async (req, res) => {
  try {
    await Empresa.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Empresa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir empresa' });
  }
});

export default router;
