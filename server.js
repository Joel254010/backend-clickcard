import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import empresaRoutes from './routes/empresaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // ✅ nova rota adicionada

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/usuarios', userRoutes);
app.use('/empresas', empresaRoutes);
app.use('/api/admin', adminRoutes); // ✅ nova rota montada

// Rota de teste
app.get('/', (req, res) => {
  res.send('🚀 Backend ClickCard está rodando com sucesso!');
});

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB Atlas conectado com sucesso!");
}).catch((err) => {
  console.error("❌ Erro ao conectar no MongoDB Atlas:", err);
});

// Porta dinâmica
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
