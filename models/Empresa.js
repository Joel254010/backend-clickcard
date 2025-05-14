import mongoose from 'mongoose';

const empresaSchema = new mongoose.Schema({
  nome: String,
  cidade: String,
  estado: String,
  segmento: String,
  foto: String,
  linkCartao: String,
});

const Empresa = mongoose.model('Empresa', empresaSchema);
export default Empresa;
