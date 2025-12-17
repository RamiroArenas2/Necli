const express = require("express");
const router = express.Router();

const Account = require("../models/account");
const User = require("../models/user");

router.post("/", async (req, res) => {
    try {
        const { Id_User, Balance_Account, Debit_Card_Number } = req.body;

        if (!Id_User) {
            return res.status(400).json({ error: "Id_User is required" });
        }

        const userExists = await User.findById(Id_User);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }

       
         const Account_Number = userExists.phone;

        const newAccount = new Account({
            Account_Number,
            user: Id_User,
            Balance_Account: Balance_Account || 0,
            Debit_Card_Number: Debit_Card_Number || null
        });

        await newAccount.save();

        return res.status(201).json(newAccount);

    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find().populate("user");
        res.status(200).json(accounts);
    } catch (error) {
        console.error("Error getting accounts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:Account_Number", async (req, res) => {
    try {
        const { Account_Number } = req.params;

        const account = await Account.findOne({ Account_Number }).populate("user");
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        res.status(200).json(account);
    } catch (error) {
        console.error("Error getting account:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
