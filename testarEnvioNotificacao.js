// testarEnvioNotificacao.js

import webpush from 'web-push';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NotificationSubscription from './models/NotificationSubscription.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const testarEnvio = async () => {
  const subs = await NotificationSubscription.find({});
  if (!subs.length) return console.log("❌ Nenhuma subscription encontrada.");

  const sub = subs[0].subscription;
  console.log("📤 Enviando notificação para:", sub.endpoint);

  try {
    await webpush.sendNotification(
      sub,
      JSON.stringify({
        title: "🔔 Teste Direto do Backend",
        body: "Essa notificação chegou com a aba fechada?"
      })
    );
    console.log("✅ Notificação enviada com sucesso.");
  } catch (err) {
    console.error("❌ Erro ao enviar notificação:", err);
  }

  mongoose.connection.close();
};

testarEnvio();
