import mongoose from 'mongoose';

const empresaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  segmento: {
    type: String,
    required: true,
  },
  cidade: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  linkCartao: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: true,
  },
  emailUsuario: {
    type: String,
    required: false, // Agora este campo é opcional e serve para vincular o dono do cartão
  },
}, {
  timestamps: true,
});

const Empresa = mongoose.model('Empresa', empresaSchema);

export default Empresa;
