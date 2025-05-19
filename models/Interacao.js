import mongoose from 'mongoose';

const interacaoSchema = new mongoose.Schema({
  empresaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Empresa',
  },
  curtidas: {
    type: [String], // lista de nomes ou e-mails de quem curtiu
    default: [],
  },
  comentarios: {
    type: [
      {
        nome: String,
        texto: String,
        data: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
}, {
  timestamps: true,
});

const Interacao = mongoose.model('Interacao', interacaoSchema);
export default Interacao;
