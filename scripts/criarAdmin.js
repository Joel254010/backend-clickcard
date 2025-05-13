import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/AdminModel.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro na conexão Mongo:", err));

async function criarAdmin() {
  const usuario = "clickcardbusiness";
  const senha = "Joelethais1984@";

  const adminExistente = await Admin.findOne({ usuario });
  if (adminExistente) {
    console.log("⚠️ Admin já existe.");
    return mongoose.disconnect();
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  const novoAdmin = new Admin({ usuario, senha: senhaCriptografada });

  await novoAdmin.save();
  console.log("✅ Admin criado com sucesso!");
  mongoose.disconnect();
}

criarAdmin();
