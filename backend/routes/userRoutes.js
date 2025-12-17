const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Account = require("../models/account");

// ============================
// REGISTER USER
// ============================
router.post("/", async (req, res) => {
  console.log("BODY RECIBIDO:", req.body);
  try {
    const { fullname, idtype, phone, email, birthDate, pin } = req.body;

    if (!fullname || !idtype || !phone || !email || !birthDate || !pin) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const exists = await User.findOne({ phone });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Calcular edad desde fecha de nacimiento
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // Crear usuario
    const newUser = new User({
      fullname,
      idtype,
      phone,
      email,
      age,
      password: pin,
    });

    await newUser.save();

    // Crear cuenta automáticamente (UNA SOLA)
    const existingAccount = await Account.findOne({
      Account_Number: phone,
    });

    if (!existingAccount) {
      const newAccount = new Account({
        Account_Number: phone,
        User: newUser._id,
        Balance_Account: 0,
        Debit_Card_Number: null,
      });

      await newAccount.save();
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

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

    res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

/* ============================
   GET ALL USERS
============================ */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ============================
   UPDATE USER INFO
============================ */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, idtype, phone, email } = req.body;
    const age = Number(req.body.age);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullname, idtype, phone, email, age },
      { new: true, runValidators: true }
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

/* ============================
   UPDATE PASSWORD
============================ */
router.put("/:id/password", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current and new passwords are required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ============================
   DELETE USER
============================ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
