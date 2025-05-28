import express from 'express'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import webpush from 'web-push'; // ✅ IMPORTAÇÃO NOVA

import empresaRoutes from './routes/empresaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import interacoesRoutes from './routes/interacoesRoutes.js'; // ✅ ROTA EXISTENTE
import notificacoesRoutes from './routes/notificacoesRoutes.js'; // ✅ NOVA ROTA DE NOTIFICAÇÕES

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // suporte a imagens base64

// ✅ CONFIGURAÇÃO DO WEB-PUSH
webpush.setVapidDetails(
  'mailto:seuemail@exemplo.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ✅ Rotas com prefixo /api
app.use('/api/empresas', empresaRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interacoes', interacoesRoutes);
app.use('/api/notificacoes', notificacoesRoutes); // ✅ NOVA LINHA ADICIONADA

// Rota de teste
app.get('/', (req, res) => {
  res.send('🚀 Backend ClickCard está rodando com sucesso!');
});

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas conectado com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar no MongoDB Atlas:", err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
