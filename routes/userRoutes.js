import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Cadastrar novo usuário
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const novoUser = new User({ nome, email, senha });
    await novoUser.save();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

// Fazer login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email, senha });
    if (!user) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    res.json({ token: 'login-simples', usuario: user.nome });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

export default router;
