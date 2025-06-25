// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import webpush from 'web-push';

// rotas de domínio ClickCard
import empresaRoutes from './routes/empresaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import interacoesRoutes from './routes/interacoesRoutes.js';
import notificacoesRoutes from './routes/notificacoesRoutes.js';
import afiliadoRoutes from './routes/afiliadoRoutes.js';
import webhookAppmaxRoutes from './routes/webhookAppmaxRoutes.js';
import cliqueAfiliadoRoutes from './routes/cliqueAfiliadoRoutes.js'; // ✅ NOVA ROTA

dotenv.config();

const app = express();

/* ---------- middlewares globais ---------- */
app.use(cors());
app.use(express.json({ limit: '10mb' })); // aceita JSON grande / imagens base64

/* ---------- Web Push (opcional) ---------- */
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn('⚠️  VAPID keys não definidas no .env');
} else {
  webpush.setVapidDetails(
    'mailto:seuemail@exemplo.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('🔐 Web Push configurado com sucesso!');
}

/* ---------- rotas principais ---------- */
app.use('/api/empresas', empresaRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interacoes', interacoesRoutes);
app.use('/api/notificacoes', notificacoesRoutes);
app.use('/api/afiliados', afiliadoRoutes);
app.use('/api/webhook/appmax', webhookAppmaxRoutes);
app.use('/api/cliques', cliqueAfiliadoRoutes); // ✅ CLIQUE DO AFILIADO

/* ---------- rota raiz ---------- */
app.get('/', (req, res) => {
  res.send('🚀 Backend ClickCard está rodando com sucesso!');
});

/* ---------- conexão com MongoDB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas');
    console.log('📂 Banco conectado:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no MongoDB Atlas:', err);
    process.exit(1);
  });

/* ---------- start ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);

  // Espera o servidor subir para garantir que o router esteja disponível
  setTimeout(() => {
    if (app._router && app._router.stack) {
      app._router.stack.forEach(layer => {
        if (layer.route && layer.route.path) {
          console.log("🔗 Rota ativa:", layer.route.path, "->", layer.route.methods);
        }
      });
    } else {
      console.warn("⚠️ app._router ainda não está disponível.");
    }
  }, 1500);
});
