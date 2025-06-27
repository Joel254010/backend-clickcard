import mongoose from 'mongoose';

const afiliadoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  linkGerado: {
    type: String,
    unique: true, // ✅ Impede dois afiliados com o mesmo link
  },
  dadosPagamento: {
    pix: String,
    banco: String,
    agencia: String,
    conta: String,
    tipoConta: String,
    nomeTitular: String,
    cpfTitular: String,
  },
  estatisticas: {
    indicacoes: {
      type: Number,
      default: 0,
    },
    vendas: {
      type: Number,
      default: 0,
    },
    comissao: {
      type: Number,
      default: 0.0,
    },
  },
  comissaoPaga: {
    type: Number,
    default: 0.0,
  },
  termoAceito: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Afiliado = mongoose.model("Afiliado", afiliadoSchema);

export default Afiliado;
