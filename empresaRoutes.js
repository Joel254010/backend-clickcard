import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Modelo de empresa
const empresaSchema = new mongoose.Schema({
  nome: String,
  cidade: String,
  estado: String,
  segmento: String,
  foto: String,
  linkCartao: String,
});
const Empresa = mongoose.model('Empresa', empresaSchema);

// Rota para cadastrar nova empresa
router.post('/nova', async (req, res) => {
  try {
    const novaEmpresa = new Empresa(req.body);
    const salva = await novaEmpresa.save();
    res.status(201).json(salva);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao salvar empresa', detalhe: error.message });
  }
});

// Rota para listar empresas
router.get('/', async (req, res) => {
  try {
    const empresas = await Empresa.find().sort({ _id: -1 });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar empresas' });
  }
});

export default router;
