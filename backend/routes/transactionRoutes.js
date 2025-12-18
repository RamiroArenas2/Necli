const express = require("express");
const router = express.Router();
const Transaction = require("../models/transactions");
const Account = require("../models/account");

// ======================
// Deposit
// ======================
router.post("/deposit", async (req, res) => {
  try {
    const { Account_Number, Amount } = req.body;
    const account = await Account.findOne({ Account_Number }).populate("user");

    if (!account || !account.user)
      return res.status(404).json({ error: "Account/User not found" });

    account.Balance_Account += Number(Amount);
    await account.save();

    await Transaction.create({
      user: account.user._id,
      type: "income",
      amount: Amount,
      description: "Depósito",
      relatedUser: "Cajero / Sucursal",
      Balance_After: account.Balance_Account,
    });

    res.status(200).json({
      message: "Deposit successful",
      newBalance: account.Balance_Account,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======================
// Withdraw
// ======================
router.post("/withdraw", async (req, res) => {
  try {
    const { Account_Number, Amount } = req.body;
    const account = await Account.findOne({ Account_Number }).populate("user");

    if (!account) return res.status(404).json({ error: "Account not found" });

    if (account.Balance_Account < Amount) {
      return res
        .status(400)
        .json({ error: "Fondos insuficientes (Revisa tus bolsillos)" });
    }

    account.Balance_Account -= Number(Amount);
    await account.save();

    await Transaction.create({
      user: account.user._id,
      type: "expense",
      amount: Amount,
      description: "Retiro",
      relatedUser: "Cajero Automático",
      Balance_After: account.Balance_Account,
    });

    res.status(200).json({
      message: "Withdraw successful",
      newBalance: account.Balance_Account,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======================
// TRANSFER (CORREGIDO)
// ======================
router.post("/transfer", async (req, res) => {
  try {
    const { From, To, Amount } = req.body;
    const monto = Number(Amount);

    const sender = await Account.findOne({ Account_Number: From }).populate(
      "user"
    );
    const receiver = await Account.findOne({ Account_Number: To }).populate(
      "user"
    );

    if (!sender || !receiver)
      return res.status(404).json({ error: "Cuenta no encontrada" });

    // VALIDACIÓN CRÍTICA: Aquí usamos Balance_Account
    if (sender.Balance_Account < monto) {
      return res.status(400).json({ error: "Fondos insuficientes" });
    }

    // Ejecutar transferencia
    sender.Balance_Account -= monto;
    receiver.Balance_Account += monto;

    await sender.save();
    await receiver.save();

    // Guardar historial (Transactions)...
    await Transaction.create({
      user: sender.user._id,
      type: "expense",
      amount: monto,
      description: "Transferencia enviada",
      relatedUser: receiver.user.fullname,
      Target_Account: To,
      Balance_After: sender.Balance_Account,
    });

    await Transaction.create({
      user: receiver.user._id,
      type: "income",
      amount: monto,
      description: "Transferencia recibida",
      relatedUser: sender.user.fullname,
      Target_Account: From,
      Balance_After: receiver.Balance_Account,
    });

    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    console.error("TRANSFER ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======================
// Get History
// ======================
router.get("/:Account_Number/history", async (req, res) => {
  try {
    const account = await Account.findOne({
      Account_Number: req.params.Account_Number,
    }).populate("user");
    if (!account || !account.user) return res.status(200).json([]);

    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const history = await Transaction.find({ user: account.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json(history);
  } catch (error) {
    return res.status(200).json([]);
  }
});

module.exports = router;
