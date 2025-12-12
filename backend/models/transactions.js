const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    Account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },

    Type: {
        type: String,
        enum: ["deposit", "withdraw", "transfer"],
        required: true
    },

    Amount: {
        type: Number,
        required: true
    },

    Balance_After: {
        type: Number,
        required: true
    },

    
    Target_Account: {
        type: String, 
        required: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
