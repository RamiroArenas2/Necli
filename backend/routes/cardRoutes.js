const express = require("express");
const router = express.Router();

const Card = require("../models/card");
const Account = require("../models/account");

router.post("/", async (req, res) => {
  try {
    const { Id_Account } = req.body;

    if (!Id_Account) {
      return res.status(400).json({ error: "Id_Account is required" });
    }

    const accountExists = await Account.findById(Id_Account);

    if (!accountExists) {
      return res.status(404).json({ error: "Account not found" });
    }

    const Id_Card = "CA" + Math.floor(100000 + Math.random() * 900000);
    const Card_Number = Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    ).toString();
    const Card_CCV = Math.floor(100 + Math.random() * 900).toString();
    const Card_Expiration_Date = "12/28";

    const newCard = new Card({
      Id_Card,
      Card_Number,
      Card_CCV,
      Card_Expiration_Date,
      Id_Account,
      Balance_Card: 0,
    });

    await newCard.save();

    return res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const cards = await Card.find().populate("Id_Account");
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error getting cards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:Id_Card", async (req, res) => {
  try {
    const { Id_Card } = req.params;

    const card = await Card.findOne({ Id_Card }).populate("Id_Account");
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error("Error getting card:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// cardRoutes.js - Corrección en la ruta de obtener por cuenta
router.get("/byAccount/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;

    // CORRECCIÓN: Usamos findById porque recibimos el _id de la cuenta
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Buscamos las tarjetas que tengan ese Id_Account
    const cards = await Card.find({ Id_Account: account._id });

    res.status(200).json(cards);
  } catch (error) {
    console.error("Error getting cards by account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
