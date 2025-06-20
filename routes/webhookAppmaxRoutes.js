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

    console.log("🔍 Buscando afiliado pelo nome:", nomeAfiliado);

    // ✅ Busca apenas pelo nome presente no linkGerado
    const afiliado = await Afiliado.findOne({
      linkGerado: { $regex: new RegExp(`${nomeAfiliado}`, 'i') }
    });

    if (!afiliado) {
      console.warn("⚠️ Afiliado não encontrado.");
      return res.status(404).json({ erro: 'Afiliado não encontrado' });
    }

    // ✅ Atualiza estatísticas
    afiliado.estatisticas.vendas += 1;
    afiliado.estatisticas.comissao += valor_total * 0.5;
    await afiliado.save();

    console.log("✅ Venda registrada com sucesso:", {
      nome: afiliado.nome,
      comissao: afiliado.estatisticas.comissao,
      vendas: afiliado.estatisticas.vendas
    });

    return res.status(200).json({ mensagem: 'Venda registrada com sucesso' });

  } catch (error) {
    console.error("❌ Erro ao registrar venda:", error);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

export default router;
