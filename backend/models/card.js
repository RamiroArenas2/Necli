const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
    Id_Card: {
        type: String,
        required: true,
        unique: true
    },

    Card_Number: {
        type: String,
        required: true,
        unique: true
    },

    Card_Expiration_Date: {
        type: String,
        required: true
    },

    Card_CCV: {
        type: String,
        required: true
    },

    Id_Account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },

    Balance_Card: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model("Card", CardSchema);
