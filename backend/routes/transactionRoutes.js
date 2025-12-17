const express = require("express");
const router = express.Router();

const Transaction = require("../models/transactions");
const Account = require("../models/account");

// ======================
// Helper para mapear tipo
// ======================
function mapTransactionType(type) {
  if (type === "deposit") return "income";
  if (type === "withdraw") return "expense";
  if (type === "transfer") return "expense"; // para quien envía
  return "expense";
}

// ======================
// Deposit
// ======================
router.post("/deposit", async (req, res) => {
  try {
    const { Account_Number, Amount } = req.body;

    const account = await Account.findOne({ Account_Number }).populate("user");
    if (!account) return res.status(404).json({ error: "Account not found" });

    account.Balance_Account += Amount;
    await account.save();

    await Transaction.create({
      user: account.user._id,
      type: mapTransactionType("deposit"),
      amount: Amount,
      description: "Depósito",
      relatedUser: "",
      Balance_After: account.Balance_Account,
    });

    res.status(200).json({ message: "Deposit successful" });
  } catch (error) {
    console.error("DEPOSIT ERROR:", error);
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

    if (!account.user) {
      return res
        .status(500)
        .json({ error: "User not associated with account" });
    }

    if (account.Balance_Account < Amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    account.Balance_Account -= Amount;
    await account.save();

    await Transaction.create({
      user: account.user._id,
      type: mapTransactionType("withdraw"),
      amount: Amount,
      description: "Retiro",
      relatedUser: "",
      Balance_After: account.Balance_Account,
    });

    res.status(200).json({ message: "Withdraw successful" });
  } catch (error) {
    console.error("WITHDRAW ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ======================
// Transfer
// ======================
router.post("/transfer", async (req, res) => {
  try {
    const { From, To, Amount } = req.body;

    const sender = await Account.findOne({ Account_Number: From }).populate(
      "user"
    );
    const receiver = await Account.findOne({ Account_Number: To }).populate(
      "user"
    );

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (!sender.user || !receiver.user) {
      return res
        .status(500)
        .json({ error: "User not associated with account" });
    }

    if (sender.Balance_Account < Amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Actualizar balances
    sender.Balance_Account -= Amount;
    receiver.Balance_Account += Amount;

    await sender.save();
    await receiver.save();

    // Crear transacción del remitente
    await Transaction.create({
      user: sender.user._id,
      type: mapTransactionType("transfer"),
      amount: Amount,
      description: "Transferencia enviada",
      relatedUser: receiver.user.name || "",
      Target_Account: To,
      Balance_After: sender.Balance_Account,
    });

    // Crear transacción del receptor
    await Transaction.create({
      user: receiver.user._id,
      type: mapTransactionType("deposit"),
      amount: Amount,
      description: "Transferencia recibida",
      relatedUser: sender.user.name || "",
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
// Get transaction history
// ======================
router.get("/:Account_Number/history", async (req, res) => {
  try {
    const account = await Account.findOne({
      Account_Number: req.params.Account_Number,
    });
    if (!account) return res.status(404).json({ error: "Account not found" });

    const history = await Transaction.find({ user: account.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(history);
  } catch (error) {
    console.error("HISTORY ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
