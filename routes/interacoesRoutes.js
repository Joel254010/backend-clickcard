import express from 'express';
import mongoose from 'mongoose';
import Interacao from '../models/Interacao.js';
import NotificationSubscription from '../models/NotificationSubscription.js';
import webpush from 'web-push';

const router = express.Router();

// Obter interações de uma empresa
router.get('/:empresaId', async (req, res) => {
  try {
    const interacao = await Interacao.findOne({ empresaId: req.params.empresaId });
    res.json(interacao || { empresaId: req.params.empresaId, curtidas: [], comentarios: [] });
  } catch (error) {
    console.error("❌ Erro ao buscar interações:", error);
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
      await enviarNotificacao(req.params.empresaId, `${nomeUsuario} curtiu seu cartão de visita.`);
    }

    await interacao.save();
    res.json(interacao);
  } catch (error) {
    console.error("❌ Erro ao curtir/descurtir:", error);
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

    await enviarNotificacao(req.params.empresaId, `${nome} comentou: "${texto}"`);

    res.json(interacao);
  } catch (error) {
    console.error("❌ Erro ao comentar:", error);
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
    console.error("❌ Erro ao excluir comentário:", error);
    res.status(500).json({ erro: 'Erro ao excluir comentário' });
  }
});

// Função para enviar notificações push
async function enviarNotificacao(empresaId, mensagem) {
  try {
    console.log("🔔 Tentando enviar notificação para empresa:", empresaId);
    const objectId = new mongoose.Types.ObjectId(empresaId);
    const sub = await NotificationSubscription.findOne({ empresaId: objectId });

    if (!sub) {
      console.warn("⚠️ Nenhuma inscrição de notificação encontrada para empresa:", empresaId);
      return;
    }

    console.log("✅ Inscrição encontrada. Enviando notificação para:", sub.subscription.endpoint);
    await webpush.sendNotification(
      sub.subscription,
      JSON.stringify({ title: 'Nova Interação', body: mensagem })
    );
    console.log("📨 Notificação enviada com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao enviar notificação:", error);
  }
}

export default router;
