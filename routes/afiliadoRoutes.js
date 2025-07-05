import express from 'express';
import Afiliado from '../models/Afiliado.js';
import CliqueAfiliado from '../models/CliqueAfiliado.js';

const router = express.Router();

// ✅ GET /api/afiliados ou /api/afiliados?email=xxx
router.get('/', async (req, res) => {
  const { email } = req.query;

  if (email) {
    try {
      const afiliado = await Afiliado.findOne({ email });
      if (!afiliado) {
        return res.status(404).json({ erro: "Afiliado não encontrado" });
      }
      return res.json(afiliado);
    } catch (error) {
      console.error("Erro ao buscar afiliado por email:", error);
      return res.status(500).json({ erro: "Erro ao buscar afiliado", detalhe: error.message });
    }
  }

  try {
    const afiliados = await Afiliado.find().sort({ createdAt: -1 });
    res.json(afiliados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar afiliados' });
  }
});

// ✅ POST /api/afiliados (com verificação de duplicidade)
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, senha, linkGerado } = req.body;

    if (!nome || !email || !telefone || !senha || !linkGerado) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    const existeLink = await Afiliado.findOne({ linkGerado });
    if (existeLink) {
      return res.status(400).json({ erro: "Esse nome já está em uso como link de afiliado. Tente outro nome." });
    }

    const existeEmail = await Afiliado.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({ erro: "Já existe um afiliado com esse e-mail." });
    }

    const novoAfiliado = new Afiliado({
      nome,
      email,
      telefone,
      senha,
      linkGerado,
      termoAceito: true,
    });

    const salvo = await novoAfiliado.save();
    res.status(201).json(salvo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao salvar afiliado', detalhe: error.message });
  }
});

// ✅ POST /api/afiliados/login
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

// ✅ PUT /api/afiliados/:id
router.put('/:id', async (req, res) => {
  try {
    const atualizado = await Afiliado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar afiliado' });
  }
});

// ✅ PUT /api/afiliados/:id/comissao
router.put('/:id/comissao', async (req, res) => {
  try {
    const { comissaoPaga } = req.body;

    if (typeof comissaoPaga !== 'number') {
      return res.status(400).json({ erro: 'O valor de comissão paga deve ser um número.' });
    }

    const atualizado = await Afiliado.findByIdAndUpdate(
      req.params.id,
      { comissaoPaga },
      { new: true }
    );

    if (!atualizado) {
      return res.status(404).json({ erro: 'Afiliado não encontrado.' });
    }

    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar comissão paga', detalhe: error.message });
  }
});

// ✅ DELETE /api/afiliados/:id
router.delete('/:id', async (req, res) => {
  try {
    await Afiliado.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Afiliado excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir afiliado' });
  }
});

// ✅ POST /api/afiliados/rastrear-clique
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

// ✅ POST /api/afiliados/redefinir-senha
router.post('/redefinir-senha', async (req, res) => {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ erro: 'Email e nova senha são obrigatórios.' });
  }

  try {
    const afiliado = await Afiliado.findOne({ email });
    if (!afiliado) {
      return res.status(404).json({ erro: 'Afiliado não encontrado.' });
    }

    afiliado.senha = novaSenha;
    await afiliado.save();

    res.status(200).json({ mensagem: 'Senha redefinida com sucesso.' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao redefinir senha', detalhe: error.message });
  }
});

export default router;
