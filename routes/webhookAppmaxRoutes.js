import express from 'express';
import Afiliado from '../models/Afiliado.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log("🎯 Webhook Appmax recebido!");
  console.log("📦 Body:", JSON.stringify(req.body, null, 2));

  try {
    const { email_comprador, valor_total, produto, link_origem } = req.body;

    let nomeAfiliado = null;

    if (link_origem) {
      try {
        const url = new URL(link_origem);
        nomeAfiliado = url.searchParams.get("ref") || url.searchParams.get("aff");
      } catch (err) {
        console.error("🌐 URL inválida recebida:", link_origem);
      }
    }

    if (!nomeAfiliado) {
      return res.status(400).json({ erro: 'Afiliado não identificado no link' });
    }

    console.log("🔍 Afiliado identificado:", nomeAfiliado);
    console.log("📡 Dados recebidos:", { email_comprador, valor_total, produto, link_origem });

    const afiliado = await Afiliado.findOne({
      linkGerado: { $regex: new RegExp(`${nomeAfiliado}`, 'i') }
    });

    if (!afiliado) {
      console.warn("⚠️ Afiliado não encontrado no MongoDB.");
      return res.status(404).json({ erro: 'Afiliado não encontrado' });
    }

    const valorConvertido = Number(valor_total);

    afiliado.estatisticas = {
      ...afiliado.estatisticas,
      vendas: (afiliado.estatisticas?.vendas || 0) + 1,
      comissao: (afiliado.estatisticas?.comissao || 0) + (valorConvertido * 0.5),
    };

    afiliado.markModified('estatisticas');
    await afiliado.save();

    console.log("✅ Venda registrada com sucesso para afiliado:", afiliado.nome);
    return res.status(200).json({ mensagem: 'Venda registrada com sucesso' });

  } catch (error) {
    console.error("❌ Erro no webhook da Appmax:", error);
    res.status(500).json({ erro: 'Erro interno ao registrar venda' });
  }
});

export default router;
