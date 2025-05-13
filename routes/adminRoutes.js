const express = require("express");
const router = express.Router();
const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Rota POST: /api/admin/login
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
    res.status(500).json({ message: "Erro no login", error });
  }
});

module.exports = router;
