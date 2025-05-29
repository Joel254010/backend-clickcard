// server.js

import express from 'express'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import webpush from 'web-push';

import empresaRoutes from './routes/empresaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import interacoesRoutes from './routes/interacoesRoutes.js';
import notificacoesRoutes from './routes/notificacoesRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Suporte para imagens base64 e JSON grandes

// ✅ Verificação e configuração do Web Push
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn("⚠️ VAPID keys não definidas no .env");
} else {
  webpush.setVapidDetails(
    'mailto:seuemail@exemplo.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log("🔐 Web Push configurado com sucesso!");
}

// ✅ Rotas
app.use('/api/empresas', empresaRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interacoes', interacoesRoutes);
app.use('/api/notificacoes', notificacoesRoutes);

// Teste de rota raiz
app.get('/', (req, res) => {
  res.send('🚀 Backend ClickCard está rodando com sucesso!');
});

// ✅ Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Erro ao conectar no MongoDB Atlas:", err);
    process.exit(1); // Encerra caso falhe a conexão
  });

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
