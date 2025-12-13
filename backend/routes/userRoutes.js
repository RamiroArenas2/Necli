const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Account = require("../models/account");

router.post("/", async (req, res) => {
  try {
    const {
      fullname,
      idtype,
      phone,
      email,
      age: birthDateString,
      pin,
    } = req.body;

    if (!fullname || !idtype || !phone || !email || !birthDateString || !pin) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User already exists" });

    // Convertir fecha de nacimiento a edad
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Crear nuevo usuario
    const newUser = new User({
      fullname,
      idtype,
      phone,
      email,
      age, // edad calculada
      password: pin,
    });

    await newUser.save();

    // Crear cuenta asociada automáticamente
    const newAccount = new Account({
      Account_Number: newUser.phone, // usamos el phone como número de cuenta
      User: newUser._id,
      Balance_Account: 0, // saldo inicial en 0
      Debit_Card_Number: null,
    });

    await newAccount.save();
    console.log(
      "Cuenta creada automáticamente para el usuario:",
      newUser.fullname
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("Login attempt:", phone, password);

    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update user information

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, idtype, phone, email, age } = req.body;

    if (!fullname || !idtype || !phone || !email || !age) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullname, idtype, phone, email, age },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// update password

router.put("/:id/password", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete account

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deletees successfully" });
  } catch (error) {
    console.error("Error deleting account: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Busca todos los documentos

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
