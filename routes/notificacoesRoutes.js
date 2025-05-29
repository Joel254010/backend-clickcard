// routes/notificacoesRoutes.js

import express from 'express';
import mongoose from 'mongoose';
import NotificationSubscription from '../models/NotificationSubscription.js';

const router = express.Router();

// Salvar ou atualizar o subscription de notificações para uma empresa
router.post('/subscribe', async (req, res) => {
  try {
    const { empresaId, subscription } = req.body;

    if (!empresaId || !subscription) {
      return res.status(400).json({ message: 'empresaId e subscription são obrigatórios.' });
    }

    const objectId = new mongoose.Types.ObjectId(empresaId);

    // Verifica se já existe inscrição
    const existente = await NotificationSubscription.findOne({ empresaId: objectId });

    if (existente) {
      await NotificationSubscription.updateOne({ empresaId: objectId }, { subscription });
      console.log("🔄 Subscription atualizada para empresa:", empresaId);
      return res.status(200).json({ message: 'Subscription atualizada com sucesso!' });
    }

    // Nova inscrição
    const nova = new NotificationSubscription({ empresaId: objectId, subscription });
    await nova.save();

    console.log("✅ Subscription salva para empresa:", empresaId);
    res.status(201).json({ message: 'Subscription salva com sucesso!' });
  } catch (error) {
    console.error("❌ Erro ao salvar subscription:", error);
    res.status(500).json({ message: 'Erro ao salvar subscription' });
  }
});

export default router;