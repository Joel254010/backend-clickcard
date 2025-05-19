import express from 'express';
import Interacao from '../models/Interacao.js';

const router = express.Router();

// Obter interações de uma empresa
router.get('/:empresaId', async (req, res) => {
  try {
    const interacao = await Interacao.findOne({ empresaId: req.params.empresaId });
    res.json(interacao || { empresaId: req.params.empresaId, curtidas: [], comentarios: [] });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar interações' });
  }
});

// Curtir ou descurtir
router.post('/:empresaId/curtir', async (req, res) => {
  const { nomeUsuario } = req.body;
  try {
    let interacao = await Interacao.findOne({ empresaId: req.params.empresaId });
    if (!interacao) {
      interacao = new Interacao({ empresaId: req.params.empresaId });
    }

    const jaCurtiu = interacao.curtidas.includes(nomeUsuario);
    if (jaCurtiu) {
      interacao.curtidas = interacao.curtidas.filter((nome) => nome !== nomeUsuario);
    } else {
      interacao.curtidas.push(nomeUsuario);
    }

    await interacao.save();
    res.json(interacao);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao curtir/descurtir' });
  }
});

// Comentar
router.post('/:empresaId/comentar', async (req, res) => {
  const { nome, texto } = req.body;
  try {
    let interacao = await Interacao.findOne({ empresaId: req.params.empresaId });
    if (!interacao) {
      interacao = new Interacao({ empresaId: req.params.empresaId });
    }

    interacao.comentarios.push({ nome, texto });
    await interacao.save();
    res.json(interacao);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao comentar' });
  }
});

// Excluir comentário
router.delete('/:empresaId/comentario/:index', async (req, res) => {
  const { empresaId, index } = req.params;
  try {
    const interacao = await Interacao.findOne({ empresaId });
    if (!interacao) return res.status(404).json({ erro: 'Interação não encontrada' });

    interacao.comentarios.splice(index, 1);
    await interacao.save();
    res.json(interacao);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir comentário' });
  }
});

export default router;
