// routes/afiliadoRoutes.js
import express from 'express';
import Afiliado from '../models/Afiliado.js';
import CliqueAfiliado from '../models/CliqueAfiliado.js'; // ✅ Importa o modelo de clique

const router = express.Router();

// GET /api/afiliados - Listar todos os afiliados
router.get('/', async (req, res) => {
  try {
    const afiliados = await Afiliado.find().sort({ createdAt: -1 });
    res.json(afiliados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar afiliados' });
  }
});

// POST /api/afiliados - Cadastrar novo afiliado
router.post('/', async (req, res) => {
  try {
    const novoAfiliado = new Afiliado(req.body);
    const salvo = await novoAfiliado.save();
    res.status(201).json(salvo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao salvar afiliado', detalhe: error.message });
  }
});

// ✅ POST /api/afiliados/login - Login do afiliado
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
  }

  try {
    const afiliado = await Afiliado.findOne({ email });

    if (!afiliado) {
      return res.status(404).json({ erro: 'Afiliado não encontrado.' });
    }

    if (afiliado.senha !== senha) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    res.status(200).json(afiliado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao realizar login.', detalhe: error.message });
  }
});

// PUT /api/afiliados/:id - Atualizar afiliado
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Afiliado.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar afiliado' });
  }
});

// DELETE /api/afiliados/:id - Excluir afiliado
router.delete('/:id', async (req, res) => {
  try {
    await Afiliado.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Afiliado excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir afiliado' });
  }
});

// ✅ POST /api/afiliados/rastrear-clique - Registrar clique do afiliado
router.post('/rastrear-clique', async (req, res) => {
  try {
    const { ref, pagina, data } = req.body;

    if (!ref) {
      return res.status(400).json({ erro: "Referência do afiliado ausente." });
    }

    const clique = new CliqueAfiliado({ ref, pagina, data });
    await clique.save();

    res.status(201).json({ mensagem: "Clique registrado com sucesso." });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao registrar clique", detalhe: error.message });
  }
});

export default router;
