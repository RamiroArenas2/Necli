const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    Id_Account: {
        type: String,
        required: true,
        unique: true
    },

    Id_User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    Balance_Account: {
        type: Number,
        default: 0
    },

    Debit_Card_Number: {
        type: String,
        required: false 
    }
}, { timestamps: true });

module.exports = mongoose.model("Account", AccountSchema);
