// routes/cliqueAfiliadoRoutes.js
import express from 'express';
import CliqueAfiliado from '../models/CliqueAfiliado.js';
import Afiliado from '../models/Afiliado.js';

const router = express.Router();

// POST /api/cliques
router.post('/', async (req, res) => {
  try {
    const { ref, pagina } = req.body;

    if (!ref) {
      return res.status(400).json({ erro: 'Referência do afiliado (ref) é obrigatória' });
    }

    // Salva o clique na coleção CliqueAfiliado
    await CliqueAfiliado.create({ ref, pagina });

    // Busca o afiliado correspondente e atualiza as indicações
    const afiliado = await Afiliado.findOne({
      linkGerado: { $regex: new RegExp(`${ref}`, 'i') },
    });

    if (afiliado) {
      afiliado.estatisticas.indicacoes = (afiliado.estatisticas.indicacoes || 0) + 1;
      afiliado.markModified('estatisticas');
      await afiliado.save();
    }

    return res.status(200).json({ mensagem: 'Clique registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar clique:', error);
    res.status(500).json({ erro: 'Erro interno ao registrar clique' });
  }
});

export default router;
