// models/CliqueAfiliado.js
import mongoose from 'mongoose';

const cliqueSchema = new mongoose.Schema({
  ref: {
    type: String,
    required: true,
  },
  pagina: String,
  data: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const CliqueAfiliado = mongoose.model('CliqueAfiliado', cliqueSchema);
export default CliqueAfiliado;
