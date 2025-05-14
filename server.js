import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import empresaRoutes from './routes/empresaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // suporte a imagens base64

// ✅ Rotas com prefixo /api
app.use('/api/empresas', empresaRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/admin', adminRoutes);

// Teste de conexão
app.get('/', (req, res) => {
  res.send('🚀 Backend ClickCard está rodando com sucesso!');
});

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas conectado com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar no MongoDB Atlas:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
