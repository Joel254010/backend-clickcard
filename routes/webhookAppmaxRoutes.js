// routes/webhookAppmaxRoutes.js
import express from 'express';
import Afiliado from '../models/Afiliado.js';

const router = express.Router();

// POST /api/webhook/appmax
router.post('/', async (req, res) => {
  try {
    const { email_comprador, valor_total, produto, link_origem } = req.body;

    const url = new URL(link_origem);
    const nomeAfiliado = url.searchParams.get("ref");

    if (!nomeAfiliado) {
      return res.status(400).json({ erro: 'Afiliado não identificado no link' });
    }

    const afiliado = await Afiliado.findOne({
      linkGerado: { $regex: new RegExp(nomeAfiliado + '$') }
    });

    if (!afiliado) {
      return res.status(404).json({ erro: 'Afiliado não encontrado' });
    }

    afiliado.estatisticas.vendas += 1;
    afiliado.estatisticas.comissao += valor_total * 0.5;

    await afiliado.save();

    return res.status(200).json({ mensagem: 'Venda registrada com sucesso' });
  } catch (error) {
    console.error("Erro no webhook da Appmax:", error);
    res.status(500).json({ erro: 'Erro interno ao registrar venda' });
  }
});

export default router;
