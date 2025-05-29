// testarColecao.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NotificationSubscription from './models/NotificationSubscription.js';

dotenv.config();

async function verificarColecao() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const colecoes = await mongoose.connection.db.listCollections().toArray();
    const nomes = colecoes.map((col) => col.name);

    if (nomes.includes('notificationsubscriptions')) {
      console.log("✅ A coleção 'notificationsubscriptions' existe.");
    } else {
      console.warn("❌ A coleção 'notificationsubscriptions' ainda NÃO foi criada.");
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Erro ao verificar a coleção:", err);
  }
}

verificarColecao();
