// backend/models/Pocket.js
const mongoose = require("mongoose");

const pocketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relacionado con tu modelo de usuario
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  targetAmount: {
    // La meta de ahorro
    type: Number,
    required: true,
  },
  currentAmount: {
    // Lo que llevas ahorrado (inicia en 0)
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pocket", pocketSchema);
