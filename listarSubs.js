// listarSubs.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NotificationSubscription from './models/NotificationSubscription.js';

dotenv.config();

async function listarInscricoes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const subs = await NotificationSubscription.find({});
    console.log("📦 Subscriptions salvas:");
    console.log(subs);
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Erro ao listar subscriptions:", error);
  }
}

listarInscricoes();
