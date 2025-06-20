// routes/webhookAppmaxRoutes.js
import express from 'express';
import Afiliado from '../models/Afiliado.js';

const router = express.Router();

// POST /api/webhook/appmax
router.post('/', async (req, res) => {
  try {
    const { email_comprador, valor_total, produto, link_origem } = req.body;

    /* ──────────────────────────────
       1) Extrai o ref da URL
    ────────────────────────────── */
    const url          = new URL(link_origem);
    const nomeAfiliado = url.searchParams.get('ref')?.trim(); // remove espaços

    if (!nomeAfiliado) {
      return res.status(400).json({ erro: 'Afiliado não identificado no link' });
    }

    /* ──────────────────────────────
       2) Log para depuração
    ────────────────────────────── */
    console.log('🔍 Buscando afiliado com ref:', nomeAfiliado);
    console.log('📡 Dados recebidos:', { email_comprador, valor_total, produto, link_origem });

    /* ──────────────────────────────
       3) Procura afiliado pelo linkGerado (#case-insensitive)
    ────────────────────────────── */
    const afiliado = await Afiliado.findOne({
      linkGerado: { $regex: new RegExp(`[?&]ref=${nomeAfiliado}$`, 'i') } // flag i = insensitive
    });

    if (!afiliado) {
      console.warn('⚠️  Afiliado não encontrado no MongoDB.');
      return res.status(404).json({ erro: 'Afiliado não encontrado' });
    }

    /* ──────────────────────────────
       4) Atualiza estatísticas
    ────────────────────────────── */
    afiliado.estatisticas.vendas   += 1;
    afiliado.estatisticas.comissao += Number(valor_total) * 0.5; // 50 % de comissão

    await afiliado.save();

    console.log(`✅ Venda registrada para ${afiliado.nome} | +R$ ${(valor_total * 0.5).toFixed(2)}`);
    return res.status(200).json({ mensagem: 'Venda registrada com sucesso' });

  } catch (error) {
    console.error('❌ Erro no webhook da Appmax:', error);
    res.status(500).json({ erro: 'Erro interno ao registrar venda' });
  }
});

export default router;
