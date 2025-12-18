const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    Account_Number: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Balance_Account: {
      // <--- ESTE ES EL NOMBRE CLAVE
      type: Number,
      default: 0,
    },
    Debit_Card_Number: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", AccountSchema);
