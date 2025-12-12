const express = require("express");
const router = express.Router();

const Transaction = require("../models/transactions");
const Account = require("../models/account");



router.post("/deposit", async (req, res) => {
    try {
        const { Account_Number, Amount } = req.body;

        const account = await Account.findOne({ Account_Number });
        if (!account) return res.status(404).json({ error: "Account not found" });

        account.Balance_Account += Amount;
        await account.save();

        await Transaction.create({
            Account: account._id,
            Type: "deposit",
            Amount,
            Balance_After: account.Balance_Account
        });

        res.status(200).json({ message: "Deposit successful" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/withdraw", async (req, res) => {
    try {
        const { Account_Number, Amount } = req.body;

        const account = await Account.findOne({ Account_Number });
        if (!account) return res.status(404).json({ error: "Account not found" });

        if (account.Balance_Account < Amount) {
            return res.status(400).json({ error: "Insufficient funds" });
        }

        account.Balance_Account -= Amount;
        await account.save();

        await Transaction.create({
            Account: account._id,
            Type: "withdraw",
            Amount,
            Balance_After: account.Balance_Account
        });

        res.status(200).json({ message: "Withdraw successful" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/transfer", async (req, res) => {
    try {
        console.log("Transfer endpoint reached");
        console.log("Body:", req.body);

        const { From, To, Amount } = req.body;

        const sender = await Account.findOne({ Account_Number: From });
        console.log("Sender:", sender);

        const receiver = await Account.findOne({ Account_Number: To });
        console.log("Receiver:", receiver);

        if (!sender || !receiver) {
            return res.status(404).json({ error: "Account not found" });
        }

        if (sender.Balance_Account < Amount) {
            return res.status(400).json({ error: "Insufficient funds" });
        }

        sender.Balance_Account -= Amount;
        receiver.Balance_Account += Amount;

        await sender.save();
        await receiver.save();

        await Transaction.create({
            Account: sender._id,
            Type: "transfer",
            Amount,
            Target_Account: To,
            Balance_After: sender.Balance_Account
        });

        await Transaction.create({
            Account: receiver._id,
            Type: "deposit",
            Amount,
            Balance_After: receiver.Balance_Account
        });

        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        console.error("TRANSFER ERROR:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/:Account_Number/history", async (req, res) => {
    try {
        const account = await Account.findOne({ Account_Number: req.params.Account_Number });
        if (!account) return res.status(404).json({ error: "Account not found" });

        const history = await Transaction.find({ Account: account._id })
            .sort({ createdAt: -1 });

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;
