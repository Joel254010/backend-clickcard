import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const admin = await Admin.findOne({ usuario });
    if (!admin) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, admin.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ message: "Login realizado com sucesso", token });
  } catch (error) {
    console.error("🔴 Erro interno no login:", error);
    res.status(500).json({ message: "Erro no login", error: error.message });
  }
});

export default router;
