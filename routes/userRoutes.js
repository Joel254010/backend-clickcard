// src/routes/userRoutes.js 
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// ✅ Cadastrar novo usuário (agora com telefone)
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  try {
    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const novoUser = new User({ nome, email, senha, telefone });
    await novoUser.save();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

// ✅ Fazer login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ email, senha });
    if (!user) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    res.json({ token: 'login-simples', nome: user.nome });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

// ✅ Listar todos os usuários (sem senha)
router.get('/', async (req, res) => {
  try {
    const usuarios = await User.find().select('-senha');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

// ✅ Excluir usuário pelo email (com decode)
router.delete('/:email', async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  try {
    const resultado = await User.deleteOne({ email });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir usuário' });
  }
});

// ✅ Redefinir senha
router.put('/redefinir-senha', async (req, res) => {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ erro: 'E-mail e nova senha são obrigatórios.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ erro: 'E-mail não encontrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    user.senha = senhaHash;
    await user.save();

    res.json({ mensagem: 'Senha atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ erro: 'Erro interno ao redefinir a senha.' });
  }
});

export default router;
