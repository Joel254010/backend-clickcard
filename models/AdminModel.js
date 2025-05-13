import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
});

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
