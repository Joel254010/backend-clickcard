import express from 'express';
import NotificationSubscription from '../models/NotificationSubscription.js';

const router = express.Router();

// Salvar o token (subscription) da empresa
router.post('/subscribe', async (req, res) => {
  try {
    const { empresaId, subscription } = req.body;

    // Verifica se já existe para evitar duplicações
    const existente = await NotificationSubscription.findOne({ empresaId });
    if (existente) {
      await NotificationSubscription.updateOne({ empresaId }, { subscription });
      return res.status(200).json({ message: 'Subscription atualizada com sucesso!' });
    }

    const nova = new NotificationSubscription({ empresaId, subscription });
    await nova.save();

    res.status(201).json({ message: 'Subscription salva com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar subscription:', error);
    res.status(500).json({ message: 'Erro ao salvar subscription' });
  }
});

export default router;
