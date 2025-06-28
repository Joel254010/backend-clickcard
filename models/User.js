// models/User.js
import mongoose from 'mongoose';

// Esquema de usuário
const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: { type: String }, // ✅ Campo adicionado
}, {
  timestamps: true // Cria automaticamente os campos createdAt e updatedAt
});

// Criação do modelo
const User = mongoose.model('User', userSchema);

export default User;
